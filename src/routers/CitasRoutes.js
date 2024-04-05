import { Router } from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import{
    cancelarCita,
    crearCita
} from "../controllers/CitaController.js";
const citaRouter = Router()

citaRouter.post("/registrar", verificarAutenticacion, crearCita) 
citaRouter.post("/cancelar/:id", verificarAutenticacion, cancelarCita) 


export default citaRouter