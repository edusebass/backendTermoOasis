
import dotenv from 'dotenv'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
dotenv.config()

export const formatoEmailRecuperarContraseña = (token) => {
    return (`
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                }
                .header {
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    background-color: #f4f4f4;
                    padding: 10px;
                    text-align: center;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>RESTABLECE TU CONTRASEÑA</h1>
                </div>
                <div class="content">
                    <p>Hola,</p>
                    <p>Para restablecer tu contraseña porfavor ingresa al siguiente enlace:</p>
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

export const formatoEmailRecuperarContraseñaMovil = (contraseña) => {
    return (`
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                }
                .header {
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    background-color: #f4f4f4;
                    padding: 10px;
                    text-align: center;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>RESTABLECE TU CONTRASEÑA</h1>
                </div>
                <div class="content">
                    <p>Hola,</p>
                    <p>Esta es tu nueva contraseña:</p>
                    <hr>
                    <p>${contraseña}<p/>
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
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                }
                .header {
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    background-color: #f4f4f4;
                    padding: 10px;
                    text-align: center;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Asignacion de cita</h1>
                </div>
                <div class="content">
                    <p>Hola,</p>
                    <p> Te han asignado una fecha el ${formattedDate} </p>
                    <p> Recuerda asistir puntualmente</p>
                    <hr>
                    <p> Además, recuerda que solo puedes cancelar tu cita hasta 1 hora antes</p>
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