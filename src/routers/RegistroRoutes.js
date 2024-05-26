import { Router } from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import { crearRegistro, obtenerRegistros, obtenerRegistroPaciente, editarRegistro } from '../controllers/RegistrosController.js'

const registroRouter = Router()

registroRouter.post("/crear", verificarAutenticacion, crearRegistro)
registroRouter.post("/editar", verificarAutenticacion, editarRegistro)
registroRouter.get("/listar", verificarAutenticacion, obtenerRegistros)
registroRouter.get("/:id", verificarAutenticacion, obtenerRegistroPaciente )

export default registroRouter