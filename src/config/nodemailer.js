import nodemailer from "nodemailer"
import dotenv from 'dotenv'
import { formatoEmailActualizacionCita, formatoEmailCancelacionCita, formatoEmailCreacionCita, formatoEmailRecordatorioCita, formatoEmailRecuperarContraseña, formatoEmailRecuperarContraseñaMovil } from "../utils/formatosEmail.js";
dotenv.config()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const emailMailRecuperarContraseña = async (userMail, token) =>{
    let info = await transporter.sendMail({
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: formatoEmailRecuperarContraseña(token)
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const emailMailRecuperarContraseñaMovil = async (userMail, contraseña) =>{
    let info = await transporter.sendMail({
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: formatoEmailRecuperarContraseñaMovil(contraseña)
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const enviarEmailCita = async (datos) => {
    const { nombrePaciente, email, especialistemail, cita } = datos;
  
    let info = await transporter.sendMail({
        to: [`${email}`, `${especialistemail}`],
        from: "edu03sebas@gmail.com",
        subject: `Saludos ${nombrePaciente} ¡Te han asignado una fecha para una cita!`,
        text: "Notificación de cita",
        html: formatoEmailCreacionCita(cita)
    })
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
  };

const emailCancelarCita = async (datos) => {
    const { email, doctorEmail, cita } = datos;

    let info = await transporter.sendMail({
    to: [`${email}`, `${doctorEmail}`],
    from: "edu03sebas@gmail.com",
    subject: "Tu cita ha sido cancelada",
    text: "Cancelacion de cita",
    html: formatoEmailCancelacionCita(cita)
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

const emailActualizarCita = async (datos) => {
    const { email, doctorEmail, cita, fechaAnterior } = datos;

    let info = await transporter.sendMail({
    to: [`${email}`, `${doctorEmail}`],
    from: "edu03sebas@gmail.com",
    subject: "Tu cita ha sido actualizada",
    text: "Actualizacion de cita",
    html: formatoEmailActualizacionCita(cita, fechaAnterior)
    });

    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

const emailRecordatorioCita = async (email, fecha) => {

    let info = await transporter.sendMail({
    to: [`${email}`],
    from: "edu03sebas@gmail.com",
    subject: "Recordatorio de cita",
    text: "Recordatorio de cita",
    html: formatoEmailRecordatorioCita(fecha)
    });

    console.log("Mensaje de recordatorio enviado satisfactoriamente: ", info.messageId);
};

export {
    emailMailRecuperarContraseña,
    emailActualizarCita,
    enviarEmailCita,
    emailCancelarCita,
    emailMailRecuperarContraseñaMovil,
    emailRecordatorioCita
}