import { Router } from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import{
    cancelarCita,
    crearCita,
    mostrarCitas
} from "../controllers/CitaController.js";
const citaRouter = Router()

citaRouter.post("/registrar", verificarAutenticacion, crearCita) 
citaRouter.post("/cancelar/:id", verificarAutenticacion, cancelarCita) 
citaRouter.get("/mostrar-todas", verificarAutenticacion, mostrarCitas) 


export default citaRouter