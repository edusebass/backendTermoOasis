import nodemailer from "nodemailer"
import dotenv from 'dotenv'
import { formatoEmailCreacionCita, formatoEmailRecuperarContraseña, formatoEmailRecuperarContraseñaMovil } from "../utils/formatosEmail.js";
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
        from: "drbariatrico250@gmail.com",
        subject: `Saludos ${nombrePaciente} ¡Te han asignado una fecha para una cita!`,
        text: "Notificación de cita",
        html: formatoEmailCreacionCita(cita)
    })
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
  };

const emailCancelarCita = async (datos) => {
    // obtiene los datos del controller
    const { email, doctorEmail, cita } = datos;
    console.log("Nodemailer email para enviar: " + email);
   
    const parsedDate = new Date(cita.inicio)
    const humanDate = parsedDate.toDateString()

    let info = await transporter.sendMail({
    //the client email
    to: [`${email}`, `${doctorEmail}`],
    //sendGrid sender id
    from: "drbariatrico250@gmail.com",
    subject: "Tu cita ha sido cancelada",
    text: "Notificación de cita",
    html: `<p>Tu cita del ${humanDate} ha sido cancelada</p>
    <p>Para poder ingresar al sistema debes hacerlo mediante tus credenciales de seguridad </p>
    <p> Puedes ingresar al sistema mediante el siguiente enlace </p>
    <p>Si tu no solicitaste este servicio, puedes ignorar este email</p>
    `,
    });

    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
    
};

const emailActualizarCita = async (datos) => {
    // obtiene los datos del controller
    const { email, doctorEmail, cita } = datos;
    console.log("Nodemailer email para enviar: " + email);
   
    const parsedDate = new Date(cita.start)
    const humanDate = parsedDate.toDateString()

    let info = await transporter.sendMail({
    //the client email
    to: [`${email}`, `${doctorEmail}`],
    //sendGrid sender id
    from: "drbariatrico250@gmail.com",
    subject: "Tu cita ha sido actualizada",
    text: "Notificación de cita",
    html: `<p>Tu cita del ${humanDate} ha sido actualizada</p>
    <p>Para poder ingresar al sistema debes hacerlo mediante tus credenciales de seguridad</p>
    <p>Se actualizo tu cita para ${parsedDate} </p>
    <p>Si tu no solicitaste este servicio, puedes ignorar este email</p>
    `,
    });

    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
    
};

export {
    emailMailRecuperarContraseña,
    emailActualizarCita,
    enviarEmailCita,
    emailCancelarCita,
    emailMailRecuperarContraseñaMovil
}