import nodemailer from "nodemailer"
import dotenv from 'dotenv'
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

const sendMailToUser = async(userMail,token)=>{
    let info = await transporter.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Verifica tu cuenta de correo electrónico",
    html: `
    <h1>Sistema de gestión (VET-ESFOT 🐶 😺)</h1>
    <hr>
    <a href=${process.env.URL_FRONTEND}confirmar/${token}>Clic para confirmar tu cuenta</a>
    <hr>
    <footer>Grandote te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

// send mail with defined transport object
const emailMailRecuperarContraseña = async (userMail, token) =>{
    let info = await transporter.sendMail({
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>TERMO OASIS</h1>
    <hr>
    
    http://localhost:3000/nueva-password/${token}
    <hr>
    Ese seria el endpoint que devolveria al correo y que se deberia utilizar 
    <footer>Manos que curan con amor</footer>
    `
    });
    // url_frontend/api/nueva-password   esto para cuando este el frontend
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const enviarEmailCita = async (datos) => {
    const { nombrePaciente, email, especialistemail, code, cita } = datos;
    console.log(email);
  
    let info = await transporter.sendMail({
      //the client email
      to: [`${email}`, `${especialistemail}`],
      //sendGrid sender id
      from: "drbariatrico250@gmail.com",
      subject: `Saludos ${nombrePaciente} ¡Te han asignado una fecha para una cita!`,
      text: "Notificación de cita",
      html: `<p> Te han asignado una fecha el ${cita.inicio} </p>
            <p> Recuerda asistir puntualmente</p>
            <p> Además, recuerda que solo puedes cancelar tucita hasta 1 hora antes</p>
            
            <p>Si tu no solicitaste este servicio, puedes ignorar este email</p>
            `,
      code
    })
    
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
  };

// send mail with defined transport object
// const sendMailToPaciente = async(userMail, password)=>{
//     let info = await transporter.sendMail({
//     from: 'admin@vet.com',
//     to: userMail,
//     subject: "Correo de bienvenida",
//     html: `
//     <h1>Sistema de gestión (VET-ESFOT 🐶 😺)</h1>
//     <hr>
//     <p>Contraseña de acceso: ${password}</p>
//     <a href=${process.env.URL_BACKEND}paciente/login>Clic para iniciar sesión</a>
//     <hr>
//     <footer>Grandote te da la Bienvenida!</footer>
//     `
//     });
//     console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
// }


export {
    sendMailToUser,
    emailMailRecuperarContraseña,
    enviarEmailCita
    // sendMailToPaciente
}