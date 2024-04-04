import { Router } from 'express'
// import verificarAutenticacion from '../middlewares/autenticacion.js'
import{
    crearCita
} from "../controllers/CitaController.js";
const citaRouter = Router()

citaRouter.post("/registrar", crearCita) //endpoint para el login


export default citaRouter