// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import usuarioRouter from './routers/UsuarioRoutes.js';
import citasRouter from './routers/CitasRoutes.js';
import registroRouter from './routers/RegistroRoutes.js';


// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})

app.use('/api', usuarioRouter) //endpoints para usuarios
app.use('/api/citas', citasRouter) //endpoints para citas
app.use('/api/registroMedico', registroRouter) //endpoints para citas



// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default  app