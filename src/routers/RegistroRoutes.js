import { Router } from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import { crearRegistro, obtenerRegistroPaciente, editarRegistro } from '../controllers/RegistrosController.js'

const registroRouter = Router()

registroRouter.post("/crear", verificarAutenticacion, crearRegistro)
registroRouter.put("/editar", verificarAutenticacion, editarRegistro)

registroRouter.get("/:id", verificarAutenticacion, obtenerRegistroPaciente )

export default registroRouter