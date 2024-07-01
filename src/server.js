// Requerir los módulos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRouter from './routes/UsuarioRoutes.js';
import citasRouter from './routes/CitasRoutes.js';
import registroRouter from './routes/RegistroRoutes.js';

import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js'; 

// Inicializaciones
const app = express();
dotenv.config();

// Configuraciones 
app.set('port', process.env.PORT || 3001);
app.use(cors());

// Middlewares 
app.use(express.json());
// Rutas 
app.get('/', (req, res) => {
    res.send("Server on");
});

app.use('/api', usuarioRouter); // Endpoints para usuarios
app.use('/api/citas', citasRouter); // Endpoints para citas
app.use('/api/registroMedico', registroRouter); // Endpoints para registros médicos
const CSS_URL ="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

// Middleware de Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Exportar la instancia de express por medio de app
export default app;
