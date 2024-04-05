// import {
//   emailCancelDate,
//   emailDate,
//   emailUpdateDate,
// } from "../helpers/emails.js";
// import { supaNotif } from "../index.js";
import CitaModelo from "../models/Citas.js";
import UsuarioModelo from "../models/Usuario.js";
import { enviarEmailCita} from "../config/nodemailer.js";
import mongoose from "mongoose";

const crearCita = async (req, res) => {
    // se obtiene los datos del body 
    const { idPaciente, idDoctor, code, dia, inicio, fin } = req.body;

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
      // //

      // Convertir las fechas de inicio y fin a objetos Date
      const diaCita = new Date(dia)
      const inicioCita = new Date(inicio)
      const finCita = new Date(fin)

      // Verificar si el inicio y el fin están en el mismo día que el especificado en "day"
      if (
          diaCita.getDate() !== inicioCita.getDate() ||
          diaCita.getMonth() !== inicioCita.getMonth() ||
          diaCita.getFullYear() !== inicioCita.getFullYear() ||
          diaCita.getDate() !== finCita.getDate() ||
          diaCita.getMonth() !== finCita.getMonth() ||
          diaCita.getFullYear() !== finCita.getFullYear()
      ) {
          return res.status(400).json({ msg: "El inicio y el fin de la cita deben estar en el mismo día que el dia de la cita" });
      }
  
      //verifica la fecha de inicio a crear
      const inicioInput = new Date(req.body.inicio);
      console.log("inicioInput: ", inicioInput);
      
      // Verificar si ya existe una cita con la misma hora de inicio
      const existingCita = await CitaModelo.findOne({
        inicio: inicioInput.toISOString(),
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
        const cita = new CitaModelo(req.body);
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
          code,
          cita: cita
        });
  
  
        // se obtiene la cita creada para mostrar en el status
        const fullCita = await CitaModelo.findById(cita._id)
          .populate("idDoctor")
          .populate("idPaciente");
  
        res.status(200).json({ msg: "Cita agendada correctamente", status: true, data: fullCita });
      }
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ msg: error.message, status: false });
    }
  };

export {
  crearCita
}