import app from './server.js'
import connection from './database.js';

//Llamar a la base de datos
connection()

//Verificar si server esta activoz
app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})