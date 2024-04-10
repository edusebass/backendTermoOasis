import { Router } from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import { crearRegistro, obtenerRegistros } from '../controllers/RegistrosController.js'

const registroRouter = Router()

registroRouter.post("/crear", verificarAutenticacion, crearRegistro)
registroRouter.get("/listar", verificarAutenticacion, obtenerRegistros)

export default registroRouter