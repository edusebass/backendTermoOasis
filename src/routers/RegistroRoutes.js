import { Router } from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import { crearRegistro, obtenerRegistros, obtenerRegistroPaciente } from '../controllers/RegistrosController.js'

const registroRouter = Router()

registroRouter.post("/crear", verificarAutenticacion, crearRegistro)
registroRouter.get("/listar", verificarAutenticacion, obtenerRegistros)
registroRouter.get("/:id", verificarAutenticacion, obtenerRegistroPaciente )

export default registroRouter