
import dotenv from 'dotenv'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
dotenv.config()

export const formatoEmailRecuperarPassword = (token) => {
    return (`
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #000000;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #B7D5CF;
                }
                .header {
                    background-color: #5D9896;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px solid #267373;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    background-color: #5D9896;
                    padding: 10px;
                    text-align: center;
                    border-top: 1px solid #267373;
                    color: white;
                }
                a {
                    color: #F27F1B;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>RESTABLECE TU password</h1>
                </div>
                <div class="content">
                    <p>Saludos,</p>
                    <p>Para restablecer tu password porfavor ingresa al siguiente enlace:</p>
                    <hr>
                    <a href=${process.env.URL_FRONTEND}restablecerPass/${token}>Click aqui<a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 TERMO OASIS. Todos los derechos reservados.</p>
                    <hr>
                    <footer>Manos que curan con amor</footer>
                </div>
            </div>
        </body>
        </html>
    `)
}

export const formatoEmailRecuperarPasswordMovil = (password) => {
    return (`
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #000000;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #B7D5CF;
                }
                .header {
                    background-color: #5D9896;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px solid #267373;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    background-color: #5D9896;
                    padding: 10px;
                    text-align: center;
                    border-top: 1px solid #267373;
                    color: white;
                }
                a {
                    color: #F27F1B;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>RESTABLECE TU password</h1>
                </div>
                <div class="content">
                    <p>Saludos,</p>
                    <p>Esta es tu nueva password:</p>
                    <hr>
                    <p>${password}<p/>
                </div>
                <div class="footer">
                    <p>&copy; 2024 TERMO OASIS. Todos los derechos reservados.</p>
                    <hr>
                    <footer>Manos que curan con amor</footer>
                </div>
            </div>
        </body>
        </html>
    `)
}

export const formatoEmailCreacionCita = (cita) => {
    const formattedDate = format(new Date(cita.start), "EEEE, d 'de' MMMM 'de' yyyy 'a las' hh:mm a", { locale: es });
    return (`
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #000000;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background-color: #B7D5CF;
            }
            .header {
                background-color: #5D9896;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #267373;
                color: white;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background-color: #5D9896;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #267373;
                color: white;
            }
            a {
                color: #F27F1B;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Asignacion de cita</h1>
                </div>
                <div class="content">
                    <p>Saludos,</p>
                    <p> Te han asignado una fecha para el ${formattedDate} </p>
                    <p> Porfavor, asistir puntualmente</p>
                    <hr>
                    <p> Además, recuerda que solo puedes cancelar tu cita hasta 24 horas antes</p>
                    <p>Si tu no solicitaste este servicio, puedes ignorar este email</p>
                    <hr>
                </div>
                <div class="footer">
                    <p>&copy; 2024 TERMO OASIS. Todos los derechos reservados.</p>
                    <hr>
                    <footer>Manos que curan con amor</footer>
                </div>
            </div>
        </body>
        </html>
    `)
}

export const formatoEmailCancelacionCita = (cita) => {
    const formattedDate = format(new Date(cita.start), "EEEE, d 'de' MMMM 'de' yyyy 'a las' hh:mm a", { locale: es });

    return (`
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #000000;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background-color: #B7D5CF;
            }
            .header {
                background-color: #5D9896;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #267373;
                color: white;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background-color: #5D9896;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #267373;
                color: white;
            }
            a {
                color: #F27F1B;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Cancelacion de cita</h1>
                </div>
                <div class="content">
                    <p>Saludos,</p>
                    <p> Tu cita del ${formattedDate} ha sido cancelada </p>
                    <hr>
                    <p>Si tu no solicitaste este servicio, puedes ignorar este email</p>
                    <hr>
                </div>
                <div class="footer">
                    <p>&copy; 2024 TERMO OASIS. Todos los derechos reservados.</p>
                    <hr>
                    <footer>Manos que curan con amor</footer>
                </div>
            </div>
        </body>
        </html>
    `)
}

export const formatoEmailActualizacionCita = (cita, fechaAnterior) => {
    const formattedDate = format(new Date(cita.start), "EEEE, d 'de' MMMM 'de' yyyy 'a las' hh:mm a", { locale: es });
    const formattedDateAnterior = format(new Date(fechaAnterior), "EEEE, d 'de' MMMM 'de' yyyy 'a las' hh:mm a", { locale: es });

    return (`
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #000000;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background-color: #B7D5CF;
            }
            .header {
                background-color: #5D9896;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #267373;
                color: white;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background-color: #5D9896;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #267373;
                color: white;
            }
            a {
                color: #F27F1B;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Actualizacion de cita</h1>
                </div>
                <div class="content">
                    <p>Saludos,</p>
                    <p> Tu cita del ${formattedDateAnterior} ha sido actualizada </p>
                    <p> Se cambio para el ${formattedDate} </p>
                    <hr>
                    <p>Si tu no solicitaste este servicio, puedes ignorar este email</p>
                    <hr>
                </div>
                <div class="footer">
                    <p>&copy; 2024 TERMO OASIS. Todos los derechos reservados.</p>
                    <hr>
                    <footer>Manos que curan con amor</footer>
                </div>
            </div>
        </body>
        </html>
    `)
}

export const formatoEmailRecordatorioCita = (fecha) => {
    const formattedDate = format(new Date(fecha), "EEEE, d 'de' MMMM 'de' yyyy 'a las' hh:mm a", { locale: es });
    // console.log("fecha: " +  formattedDate)
    return (`
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #000000;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                background-color: #B7D5CF;
            }
            .header {
                background-color: #5D9896;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #267373;
                color: white;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background-color: #5D9896;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #267373;
                color: white;
            }
            a {
                color: #F27F1B;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Recordatorio de cita</h1>
                </div>
                <div class="content">
                    <p>Saludos,</p>
                    <p> Le recordamos que tiene una cita dentro de 12 horas, exactamente para el: ${formattedDate}</p>
                    <hr>
                    <p>Si tu no solicitaste este servicio, puedes ignorar este email</p>
                    <hr>
                </div>
                <div class="footer">
                    <p>&copy; 2024 TERMO OASIS. Todos los derechos reservados.</p>
                    <hr>
                    <footer>Manos que curan con amor</footer>
                </div>
            </div>
        </body>
        </html>
    `)
}