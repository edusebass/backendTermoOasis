import mongoose from "mongoose";
import CitaModelo from "../models/Citas.js";
import UsuarioModelo from "../models/Usuario.js";
import { emailActualizarCita, emailCancelarCita, enviarEmailCita} from "../config/nodemailer.js";

const crearCita = async (req, res) => {
    // se obtiene los datos del body 
    const { idPaciente, idDoctor, start, end, comentarios } = req.body;

    // verifica si estan llenos todos los campos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

    try {
      //verifica si el paciente y el doctor existen 
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
      //verifica la fecha de inicio a crear
      const inicioInput = new Date(req.body.start);
      console.log("inicioInput: ", inicioInput);
      
      // Verificar si ya existe una cita con la misma hora de inicio
      const existingCita = await CitaModelo.findOne({
        start: inicioInput.toISOString(),
      });

      if (existingCita) {
        if (existingCita.idPaciente !== existePaciente[0]._id || existingCita.idDoctor === idDoctor) {
          res
            .status(400)
            .json({ msg: "Ya existe una cita en ese horario!", status: false });
        }
      } else {
        // si todo sale bien se guarda la cita
        // se guarda la cita
        const cita = new CitaModelo({
          idPaciente,
          idDoctor,
          start,
          end,
          comentarios,
          registroMedico: null, 
        });
        await cita.save();
  
        // se introduce la cita id tanto como en paciente como al doctor
        existePaciente[0].citas.push(cita._id);
        await existePaciente[0].save();
  
        existeDoctor[0].citas.push(cita._id);
        existeDoctor[0].pacientes.push(idPaciente);
        await existeDoctor[0].save();
  
        // se envia el email para la cita
        enviarEmailCita({
          nombrePaciente: existePaciente[0].nombre,
          email: existePaciente[0].email,
          emailDoctor: existeDoctor[0].email,
          cita: cita
        });
  
  
        // se obtiene la cita creada para mostrar en el status
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

const cancelarCita = async (req, res) => {
  const { id } = req.params;

  // verifica si estan llenos todos los campos
  if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})


  try {
    const cita = await CitaModelo.findById(id)
      .populate("idDoctor")
      .populate("idPaciente");

    if (!cita) {
      const error = new Error("Cita no encontrada");
      return res.status(401).json({ msg: error.message });
    }

    // Obtenemos la fecha y hora actual y la fecha de inicio de la cita
    const ahora = new Date();
    const inicioCita = new Date(cita.inicio);

    // Calculamos la diferencia en milisegundos entre la fecha y hora actual y el inicio de la cita
    const diferenciaTiempo = inicioCita.getTime() - ahora.getTime();

    // Verificamos si la diferencia es menor a 24 horas en milisegundos (86400000 milisegundos en un día)
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

const editarCita = async (req, res) => {
  const { id } = req.params;
  
  try {
    const cita = await CitaModelo.findById(id);

    if (!cita) {
      const error = new Error("Cita no encontrada");
      return res.status(401).json({ msg: error.message });
    } else if (cita){
      cita.dia = req.body.dia || cita.dia;
      cita.inicio = req.body.inicio || cita.inicio;
      cita.fin = req.body.fin || cita.fin;
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
        firstname: existPaciente[0].nombre,
        email: existPaciente[0].email,
        especialistemail: existDoctor[0].email,
        cita
      });

      res.status(200).json({ msg: citastored, status: true });
    } else {
      const error = new Error("Usuario no autorizado para esta accion");
      return res.status(400).json({ msg: error.message, status: false });
    }
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es valido" });
  }
};

const mostrarCitas = async (req, res) => {
  // const { user } = req;

  // if (!user.isDoctor) {
  //   const error = new Error("Usuario no autorizado para esta accion");
  //   return res.status(400).json({ msg: error.message, status: false });
  // }

  try {
    // obtiene la cita
    const citas = await CitaModelo.find().populate("idPaciente")

    // ordena el orden de muestra de la cita
    citas.sort((date1, date2) => date2.updatedAt - date1.updatedAt);

    res.status(200).json({ data: citas, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const mostrarCitaID = async (req, res) => {
  const { id } = req.params;
  try {
    // obtiene la cita por el id
    const citaExist = await CitaModelo.findById(id).populate("idPaciente");

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

const mostrarCitasPorPaciente = async (req, res) => {
  const { id } = req.params;
  try {
      const dates = await CitaModelo.find({
        idPaciente: new mongoose.Types.ObjectId(id),
      })
        .populate("idDoctor");
      res.status(200).json({ data: dates, status: true });
    
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

export {
  crearCita,
  editarCita,
  cancelarCita,
  mostrarCitas,
  mostrarCitaID,
  mostrarCitasPorPaciente
}