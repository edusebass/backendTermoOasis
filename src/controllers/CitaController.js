import mongoose from "mongoose";
import CitaModelo from "../models/Citas.js";
import UsuarioModelo from "../models/Usuario.js";
import { emailActualizarCita, emailCancelarCita, emailRecordatorioCita, enviarEmailCita} from "../config/nodemailer.js";
import cron from 'node-cron';

const crearCita = async (req, res) => {
  const { idPaciente, idDoctor, start, end, comentarios } = req.body;

  const isSecre = req.headers['issecre'] === 'true';

  // Verificar los permisos de acceso
  if (!isSecre) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }

  if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

  try {
    const existePaciente = await UsuarioModelo.find({
      _id: idPaciente,
      isPatient: true,
    });
    const existeDoctor = await UsuarioModelo.find({
      _id: idDoctor,
      isDoctor: true,
    });
    if (!existePaciente[0]) {
      const error = new Error("Paciente no se encuentra registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }
    if (!existeDoctor[0]) {
      const error = new Error("Doctor no se encuentra registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    const startISO = req.body.start; 
    const endISO = req.body.end; 

    let inicioInput = new Date(startISO);
    let finInput = new Date(endISO);
    if (inicioInput < new Date() || finInput < new Date()) {
      const error = new Error("No puedes agendar citas en el pasado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si las fechas de inicio y fin son iguales
    if (inicioInput.getTime() === finInput.getTime()) {
      const error = new Error("Debes elegir un horario de inicio y fin diferente");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si la diferencia entre las fechas es menor a una hora
    const diferenciaHoras = (finInput.getTime() - inicioInput.getTime()) / (1000 * 60 * 60);
    if (diferenciaHoras < 1) {
      const error = new Error("La diferencia entre la hora de inicio y fin debe ser de al menos una hora, en el mismo dia y en el mismo mes");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si start y end están en el mismo día
    if (inicioInput.toISOString().substr(0, 10) !== finInput.toISOString().substr(0, 10)) {
      throw new Error("El inicio y fin de la cita deben ser en el mismo día");
    }

    // Verificar si start y end están en el mismo año
    if (inicioInput.getFullYear() !== new Date().getFullYear() || finInput.getFullYear() !== new Date().getFullYear()) {
      throw new Error("El inicio y fin de la cita deben ser en el mismo año actual");
    }
    inicioInput.setHours(inicioInput.getHours() - 5);

    const inicioDesde = new Date(inicioInput);
    inicioDesde.setMinutes(inicioDesde.getMinutes() - 1);

    const inicioHasta = new Date(inicioInput);
    inicioHasta.setMinutes(inicioHasta.getMinutes() + 1);

    const existingCita = await CitaModelo.findOne({
      start: {
        $gte: inicioDesde.toISOString(),
        $lte: inicioHasta.toISOString()
      }
    });

    if (existingCita) {
      return res.status(400).json({ msg: "Ya existe una cita en ese horario!", status: false });
    } else {
      const cita = new CitaModelo({
        idPaciente,
        idDoctor,
        start,
        end,
        comentarios,
        registroMedico: null, 
      });
      await cita.save();

      existePaciente[0].citas.push(cita._id);
      await existePaciente[0].save();

      existeDoctor[0].citas.push(cita._id);
      existeDoctor[0].pacientes.push(idPaciente);
      await existeDoctor[0].save();

      enviarEmailCita({
        nombrePaciente: existePaciente[0].nombre,
        email: existePaciente[0].email,
        emailDoctor: existeDoctor[0].email,
        cita: cita
      });

      const fullCita = await CitaModelo.findById(cita._id)
        .populate("idDoctor")
        .populate("idPaciente")
        .populate("registroMedico")

      res.status(200).json({ msg: "Cita agendada correctamente", status: true, data: fullCita });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};

const editarCita = async (req, res) => {
  const { id } = req.params;
  const isSecre = req.headers['issecre'] === 'true';
  
  try {
    const cita = await CitaModelo.findById(id);

    if (!isSecre) {
      return res.status(403).json({ msg: "Acceso denegado", status: false });
    }

    const startISO = req.body.start; 
    const endISO = req.body.end; 

    let inicioInput = new Date(startISO);
    let finInput = new Date(endISO);
    if (inicioInput < new Date() || finInput < new Date()) {
      const error = new Error("No puedes reagendar citas en el pasado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si las fechas de inicio y fin son iguales
    if (inicioInput.getTime() === finInput.getTime()) {
      const error = new Error("Debes elegir un horario de inicio y fin diferente");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si la diferencia entre las fechas es menor a una hora
    const diferenciaHoras = (finInput.getTime() - inicioInput.getTime()) / (1000 * 60 * 60);
    if (diferenciaHoras < 1) {
      const error = new Error("La diferencia entre la hora de inicio y fin debe ser de al menos una hora, en el mismo dia y en el mismo mes");
      return res.status(400).json({ msg: error.message, status: false });
    }

    // Verificar si start y end están en el mismo día
    if (inicioInput.toISOString().substr(0, 10) !== finInput.toISOString().substr(0, 10)) {
      throw new Error("El inicio y fin de la cita deben ser en el mismo día");
    }

    // Verificar si start y end están en el mismo año
    if (inicioInput.getFullYear() !== new Date().getFullYear() || finInput.getFullYear() !== new Date().getFullYear()) {
      throw new Error("El inicio y fin de la cita deben ser en el mismo año actual");
    }

    if (!cita) {
      const error = new Error("Cita no encontrada");
      return res.status(401).json({ msg: error.message });
    } else if (cita){
      const citaAnterior = cita.start 
      cita.start = req.body.start || cita.start;
      cita.end = req.body.end || cita.end;
      cita.comentarios = req.body.comentarios || cita.comentarios;
      cita.isCancelado = req.body.isCancelado || cita.isCancelado;
      const citastored = await cita.save();

      const existPaciente = await UsuarioModelo.find({
        _id: cita.idPaciente,
        isPaciente: true,
      });
      const existDoctor = await UsuarioModelo.find({
        _id: cita.idDoctor,
        isDoctor: true
      });

      if (!existPaciente[0]) {
        const error = new Error("Paciente no registrado");
        return res.status(400).json({ msg: error.message, status: false });
      }

      if (!existDoctor[0]) {
        const error = new Error("Especialista no registrado");
        return res.status(400).json({ msg: error.message, status: false });
      }

      emailActualizarCita({
        fechaAnterior: citaAnterior,
        firstname: existPaciente[0].nombre,
        email: existPaciente[0].email,
        especialistemail: existDoctor[0].email,
        cita
      });

      res.status(200).json({ response:"Cita actualizada exitosamente" ,msg: citastored, status: true });
    } else {
      const error = new Error("Usuario no autorizado para esta accion");
      return res.status(400).json({ msg: error.message, status: false });
    }
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es valido" });
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
    select: 'nombre apellido password'
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