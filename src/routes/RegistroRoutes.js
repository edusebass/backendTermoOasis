import { Router } from 'express';
import verificarAutenticacion from '../middlewares/autenticacion.js';
import { crearRegistro, obtenerRegistroPaciente, editarRegistro } from '../controllers/RegistrosController.js';

const registroRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Registros Médicos
 *   description: Endpoints relacionados con los registros médicos
 */

/**
 * @swagger
 * /api/registroMedico/crear:
 *   post:
 *     summary: Crear un nuevo registro médico
 *     description: Crea un nuevo registro médico para un paciente, asociado a una cita y a un doctor.
 *     tags: [Registros Médicos]
 *     parameters:
 *       - name: isdoctor
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPaciente
 *               - idDoctor
 *               - idCita
 *             properties:
 *               idPaciente:
 *                 type: string
 *                 description: ID del paciente
 *               idDoctor:
 *                 type: string
 *                 description: ID del doctor
 *               idCita:
 *                 type: string
 *                 description: ID de la cita
 *               receta:
 *                 type: string
 *                 description: Receta médica
 *               dieta:
 *                 type: string
 *                 description: Información de la dieta del paciente
 *               actividad:
 *                 type: string
 *                 description: Información de la actividad física del paciente
 *               cuidados:
 *                 type: string
 *                 description: Información de los cuidados del paciente
 *               informacionMedica:
 *                 type: string
 *                 description: Información médica adicional
 *               comments:
 *                 type: string
 *                 description: Comentarios adicionales
 *     responses:
 *       200:
 *         description: Registro médico creado correctamente
 *       400:
 *         description: Error en la solicitud (p.ej., paciente, doctor o cita no registrados)
 *       500:
 *         description: Error interno del servidor
 */
registroRouter.post("/crear", verificarAutenticacion, crearRegistro);

/**
 * @swagger
 * /api/registroMedico/editar/{id}:
 *   put:
 *     summary: Editar un registro médico por ID
 *     description: Actualiza los campos de un registro médico existente por su ID.
 *     tags: [Registros Médicos]
 * 
 *     parameters:
 *       - in: header
 *         name: isdoctor
 *         required: true
 *         schema:
 *           type: string
 *         description: Indica si el usuario que realiza la solicitud es un secretario/a
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro medico
 *       - in: body
 *         name: registro
 *         description: Datos del registro médico a actualizar
 *         schema:
 *           type: object
 *           properties:
 *             receta:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre del medicamento
 *                   dosis:
 *                     type: string
 *                     description: Dosis del medicamento
 *                   frecuencia:
 *                     type: string
 *                     description: Frecuencia de administración del medicamento
 *               description: Lista de recetas médicas
 *             dieta:
 *               type: string
 *               description: Información de la dieta del paciente
 *             actividad:
 *               type: string
 *               description: Información de la actividad física del paciente
 *             cuidados:
 *               type: string
 *               description: Información de los cuidados del paciente
 *             informacionMedica:
 *               type: object
 *               properties:
 *                 altura:
 *                   type: number
 *                   description: Altura del paciente en centímetros
 *                 peso:
 *                   type: number
 *                   description: Peso del paciente en kilogramos
 *               description: Información médica adicional
 *             comments:
 *               type: string
 *               description: Comentarios adicionales
 *     responses:
 *       200:
 *         description: Registro médico actualizado exitosamente
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error interno del servidor
 */
registroRouter.put("/editar/:id", verificarAutenticacion, editarRegistro);

/**
 * @swagger
 * /api/registroMedico/{id}:
 *   get:
 *     summary: Obtener registro de paciente por ID
 *     description: Obtener un registro médico de paciente por su ID.
 *     tags: [Registros Médicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro médico del paciente
 *       - in: header
 *         name: issecre
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario es secretaria
 *       - in: header
 *         name: isdoctor
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario es doctor
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
