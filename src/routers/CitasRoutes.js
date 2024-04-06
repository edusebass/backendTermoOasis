import { Router } from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import{
    cancelarCita,
    crearCita,
    mostrarCitas,
    mostrarCitaID,
    mostrarCitasPorPaciente
} from "../controllers/CitaController.js";
const citaRouter = Router()

citaRouter.post("/registrar", verificarAutenticacion, crearCita) 
citaRouter.post("/cancelar/:id", verificarAutenticacion, cancelarCita) 
citaRouter.get("/mostrar-todas", verificarAutenticacion, mostrarCitas) 
citaRouter.get("/mostrar/:id", verificarAutenticacion, mostrarCitaID) 
citaRouter.get("/mostrar-por-paciente/:id", verificarAutenticacion, mostrarCitasPorPaciente) 


export default citaRouter