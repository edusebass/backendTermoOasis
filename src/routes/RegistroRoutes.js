import { Router } from 'express';
import verificarAutenticacion from '../middlewares/autenticacion.js';
import { crearRegistro, obtenerRegistroPaciente, editarRegistro } from '../controllers/RegistrosController.js';

const registroRouter = Router();

registroRouter.post("/crear", verificarAutenticacion, crearRegistro);

registroRouter.put("/editar/:id", verificarAutenticacion, editarRegistro);


/**
 * @swagger
 * /api/registroMedico/{id}:
 *   get:
 *     summary: Obtener registro de paciente por ID
 *     description: Obtener un registro médico de paciente por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro médico del paciente
 *     responses:
 *       '200':
 *         description: Registro médico obtenido correctamente
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Registro médico no encontrado
 */

registroRouter.get("/:id", verificarAutenticacion, obtenerRegistroPaciente);

export default registroRouter;
