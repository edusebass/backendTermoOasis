import mongoose from "mongoose";
import CitaModelo from "../models/Citas.js";
import UsuarioModelo from "../models/Usuario.js";
import { emailActualizarCita, emailCancelarCita, emailRecordatorioCita, enviarEmailCita} from "../config/nodemailer.js";
import cron from 'node-cron';

const crearCita = async (req, res) => {
  const { idPaciente, idDoctor, start, end, comentarios } = req.body;

  const isSecre = req.headers['issecre'] === 'true';
  if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

  // Verificar los permisos de acceso
  if (!isSecre) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }

  if (Object.values(req.body).includes("")) {
    return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }

  if (!idPaciente || !idDoctor || !start || !end || comentarios === undefined) {
    return res.status(400).json({ msg: "Lo sentimos, debes poner todos los campos en el body", status: false });
  }

  if (comentarios.length > 50) {
    return res.status(400).json({ msg: "El comentario no debe exceder los 30 caracteres", status: false });
  }

  if (!mongoose.Types.ObjectId.isValid(idPaciente) || !mongoose.Types.ObjectId.isValid(idDoctor)) {
    return res.status(400).json({ msg: "El ID no es válido no pertenece a mongoDB", status: false });
  }

  try {
    const existePaciente = await UsuarioModelo.findOne({
      _id: idPaciente,
      isPatient: true,
    });
    const existeDoctor = await UsuarioModelo.findOne({
      _id: idDoctor,
      isDoctor: true,
    });

    if (!existePaciente) {
      return res.status(400).json({ msg: "Paciente no se encuentra registrado", status: false });
    }
    if (!existeDoctor) {
      return res.status(400).json({ msg: "Doctor no se encuentra registrado", status: false });
    }

    // Verificar el formato de fecha
    const inicioInput = new Date(start);
    const finInput = new Date(end);

    if (inicioInput < new Date() || finInput < new Date()) {
      return res.status(400).json({ msg: "No puedes agendar citas en el pasado", status: false });
    }

    if (inicioInput.getTime() === finInput.getTime()) {
      return res.status(400).json({ msg: "Debes elegir un horario de inicio y fin diferente", status: false });
    }

    const diferenciaHoras = (finInput.getTime() - inicioInput.getTime()) / (1000 * 60 * 60);
    if (diferenciaHoras < 1) {
      return res.status(400).json({ msg: "La diferencia entre la hora de inicio y fin debe ser de al menos una hora", status: false });
    }

    if (diferenciaHoras !== 1) {
      return res.status(400).json({ msg: "La cita debe durar exactamente una hora", status: false });
    }

    const startDateStr = start;
    const endDateStr = end;

    if (startDateStr.substr(0, 10) !== endDateStr.substr(0, 10)) {
      return res.status(400).json({ msg: "El inicio y fin de la cita deben ser en el mismo día", status: false });
    }

    const currentYear = new Date().getFullYear();
    if (new Date(startDateStr).getFullYear() !== currentYear || new Date(endDateStr).getFullYear() !== currentYear) {
      return res.status(400).json({ msg: "El inicio y fin de la cita deben ser en el mismo año actual", status: false });
    }

    // Verificar si hay conflictos con otras citas, permitiendo un minuto de superposición
    const existingCita = await CitaModelo.findOne({
      $or: [
        {
          start: { $lt: new Date(new Date(endDateStr).getTime() + 60000).toISOString() }, // Permitir un minuto después de end
          end: { $gt: new Date(new Date(startDateStr).getTime() - 60000).toISOString() } // Permitir un minuto antes de start
        },
        {
          start: { $lte: startDateStr },
          end: { $gte: endDateStr }
        },
        {
          start: { $lte: startDateStr },
          end: { $gte: startDateStr }
        }
      ]
    });

    if (existingCita) {
      return res.status(400).json({ msg: "Ya existe una cita en ese horario!", status: false });
    }

    // Guardar la nueva cita
    const cita = new CitaModelo({
      idPaciente,
      idDoctor,
      start,
      end,
      comentarios,
      registroMedico: null,
    });
    await cita.save();

    // Actualizar los registros de paciente y doctor
    existePaciente.citas.push(cita._id);
    await existePaciente.save();

    existeDoctor.citas.push(cita._id);
    existeDoctor.pacientes.push(idPaciente);
    await existeDoctor.save();

    // Enviar el correo electrónico
    enviarEmailCita({
      nombrePaciente: existePaciente.nombre,
      email: existePaciente.email,
      emailDoctor: existeDoctor.email,
      cita: cita
    });

    // Obtener la cita completa con las referencias pobladas
    const fullCita = await CitaModelo.findById(cita._id)
      .populate("idDoctor")
      .populate("idPaciente")
      .populate("registroMedico");

    res.status(200).json({ msg: "Cita agendada correctamente", status: true, data: fullCita });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};


const editarCita = async (req, res) => {
  const { id } = req.params;
  const isSecre = req.headers['issecre'] === 'true';
  console.log(id)
  
  try {
    const cita = await CitaModelo.findById(id);
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

    if (!isSecre) {
      return res.status(403).json({ msg: "Acceso denegado", status: false });
    }

    if (!cita) {
      const error = new Error("Cita no encontrada");
      return res.status(404).json({ msg: error.message, status: false });
    }

    const { start: startISO, end: endISO, comentarios, isCancelado } = req.body;

    if ( !startISO || !endISO || !isCancelado || comentarios === undefined) {
      return res.status(400).json({ msg: "Lo sentimos, faltan campos", status: false });
    }
  
    if (comentarios.length > 50) {
      return res.status(400).json({ msg: "El comentario no debe exceder los 30 caracteres", status: false });
    }

    let inicioInput = new Date(startISO);
    let finInput = new Date(endISO);

    // Verificar si las fechas de inicio y fin están en el pasado
    if (inicioInput < new Date() || finInput < new Date()) {
      const error = new Error("No puedes reagendar citas en el pasado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si las fechas de inicio y fin son iguales
    if (inicioInput.getTime() === finInput.getTime()) {
      const error = new Error("Debes elegir un horario de inicio y fin diferente");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si la diferencia entre las fechas es exactamente una hora
    const diferenciaHoras = (finInput.getTime() - inicioInput.getTime()) / (1000 * 60 * 60);
    if (diferenciaHoras !== 1) {
      const error = new Error("La cita debe durar exactamente una hora");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si start y end están en el mismo día
    if (inicioInput.toISOString().substr(0, 10) !== finInput.toISOString().substr(0, 10)) {
      const error = new Error("El inicio y fin de la cita deben ser en el mismo día");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si start y end están en el mismo año
    if (inicioInput.getFullYear() !== new Date().getFullYear() || finInput.getFullYear() !== new Date().getFullYear()) {
      const error = new Error("El inicio y fin de la cita deben ser en el mismo año actual");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si hay conflictos con otras citas
    const existingCita = await CitaModelo.findOne({
      $or: [
        {
          _id: { $ne: id },
          start: { $lt: endISO },
          end: { $gt: startISO }
        },
        {
          _id: { $ne: id },
          start: { $lte: startISO },
          end: { $gte: endISO }
        },
        {
          _id: { $ne: id },
          start: { $lte: startISO },
          end: { $gte: startISO }
        }
      ]
    });

    if (existingCita) {
      const error = new Error("Ya existe una cita en ese horario!");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Actualizar la cita en la base de datos
    const citaAnterior = cita.start;
    cita.start = startISO || cita.start;
    cita.end = endISO || cita.end;
    cita.comentarios = comentarios || cita.comentarios;
    cita.isCancelado = isCancelado || cita.isCancelado;
    const citastored = await cita.save();

    // Verificar la existencia de paciente y doctor
    const existPaciente = await UsuarioModelo.findOne({
      _id: cita.idPaciente,
      isPatient: true,
    });
    const existDoctor = await UsuarioModelo.findOne({
      _id: cita.idDoctor,
      isDoctor: true
    });

    if (!existPaciente) {
      const error = new Error("Paciente no registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    if (!existDoctor) {
      const error = new Error("Especialista no registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Enviar el correo electrónico de actualización de cita
    emailActualizarCita({
      fechaAnterior: citaAnterior,
      firstname: existPaciente.nombre,
      email: existPaciente.email,
      especialistemail: existDoctor.email,
      cita
    });
    res.status(200).json({ response: "Cita actualizada exitosamente", msg: citastored, status: true });
    } catch {
      res.status(400).json({ msg: error.message, status: false });
    }
 
};


const mostrarCitasPorPaciente = async (req, res) => {
  const { id } = req.params;
  const isSecre = req.headers['issecre'] === 'true';
  const isDoctor = req.headers['isdoctor'] === 'true';
  const isPaciente = req.headers['ispaciente'] === 'true';

  if (!isSecre && !isDoctor && !isPaciente) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }
  console.log(id)
  console.log(typeof id)
  try {
      const dates = await CitaModelo.find({
        idPaciente: id,
      }).populate("idDoctor")
      
      res.status(200).json({ data: dates, status: true });
    
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const cancelarCita = async (req, res) => {
  const { id } = req.params;
  
  const isSecre = req.headers['issecre'] === 'true';
  const isPatient = req.headers['ispaciente'] === 'true';
  
  // Verificar los permisos de acceso
  if (!isSecre && !isPatient) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }

  if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

  try {
    const cita = await CitaModelo.findById(id)
      .populate("idDoctor")
      .populate("idPaciente");

    if (!cita) {
      const error = new Error("Cita no encontrada");
      return res.status(401).json({ msg: error.message });
    }

    const ahora = new Date();
    const inicioCita = new Date(cita.start);
    console.log(inicioCita)
    const diferenciaTiempo = inicioCita.getTime() - ahora.getTime();
    if (diferenciaTiempo < 86400000) {
      return res.status(400).json({ msg: "No puedes cancelar la cita con menos de 24 horas de antelación" });
    }

    emailCancelarCita({
      email: cita.idPaciente.email,
      doctorEmail: cita.idDoctor.email,
      cita,
    });
    await CitaModelo.updateOne({ _id: id }, { isCancelado: true });
    res.status(200).json({ msg: "Cita cancelada exitosamente", status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const mostrarCitas = async (req, res) => {
  const isSecre = req.headers['issecre'] === 'true';
  const isDoctor = req.headers['isdoctor'] === 'true';
  const isPaciente = req.headers['ispaciente'] === 'true';

  if (!isSecre && !isDoctor && !isPaciente) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }
  
  try {
    const citas = await CitaModelo.find().populate({
    path: 'idPaciente',
    select: 'nombre apellido cedula'
  })

    citas.sort((date1, date2) => date2.updatedAt - date1.updatedAt);

    res.status(200).json({ data: citas, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const mostrarCitaID = async (req, res) => {
  const { id } = req.params;
  
  const isSecre = req.headers['issecre'] === 'true';
  const isDoctor = req.headers['isdoctor'] === 'true';
  const isPaciente = req.headers['ispaciente'] === 'true';

  console.log(isSecre, isDoctor, isPaciente)
  
  if (!isSecre && !isDoctor && !isPaciente) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }

  try {
    // obtiene la cita por el id
    const citaExist = await CitaModelo.findById(id).populate("idPaciente").populate({
      path: "idDoctor",
      select: "nombre apellido"
    });;

    // si no existe salta un error
    if (!citaExist) {
      const error = new Error("Cita no existe");
      return res.status(401).json({ msg: error.message });
    }
    res.status(200).json({ data: citaExist, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const verificarCitasProximas = async () => {
  const ahora = new Date();
  const doceHorasAntes = new Date(ahora.getTime() - 12 * 60 * 60 * 1000);

  try {
    const citasProximas = await CitaModelo.find({
      start: { $gte: doceHorasAntes.toISOString(), $lte: ahora.toISOString() },
      recordatory: false // Filtrar solo las citas donde recordatory sea false
    }).populate('idPaciente');

    for (const cita of citasProximas) {
      await emailRecordatorioCita(cita.idPaciente.email, cita.start);

      // Actualizar el campo recordatory a true después de enviar el mensaje
      cita.recordatory = true;
      await cita.save();
    }

    console.log("Revisando si hay citas proximas...");
  } catch (error) {
    console.error('Error al verificar las citas próximas:', error);
  }
};

cron.schedule('*/60 * * * * *', verificarCitasProximas); // Ejecutar cada 30 segundos

export {
  crearCita,
  editarCita,
  cancelarCita,
  mostrarCitas,
  mostrarCitaID,
  mostrarCitasPorPaciente
}