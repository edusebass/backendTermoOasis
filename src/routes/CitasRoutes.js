import { Router } from "express";
import verificarAutenticacion from "../middlewares/autenticacion.js";
import {
  cancelarCita,
  crearCita,
  mostrarCitas,
  mostrarCitaID,
  mostrarCitasPorPaciente,
  editarCita,
} from "../controllers/CitaController.js";

const citaRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Citas Médicas
 *   description: Endpoints relacionados con las citas médicas
 */

/**
 * @swagger
 * /api/citas/registrar:
 *   post:
 *     summary: Crear una nueva cita médica
 *     description: Crear una nueva cita médica proporcionando la información necesaria.
 *     tags: [Citas Médicas]
 *     parameters:
 *       - in: header
 *         name: issecre
 *         required: true
 *         schema:
 *           type: string
 *         description: Indica si el usuario es secretario (true o false)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPaciente:
 *                 type: ObjectId
 *                 description: ID del paciente
 *               idDoctor:
 *                 type: ObjectId
 *                 description: ID del doctor
 *               start:
 *                 type: string
 *                 format: date
 *                 description: Fecha y hora de inicio de la cita
 *                 pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"
 *                 example: "2024-08-12T11:28"
 *               end:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de fin de la cita
 *                 pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"
 *                 example: "2024-08-12T12:28"
 *               comentarios:
 *                 type: string
 *                 description: Comentarios adicionales para la cita
 *             required:
 *               - idPaciente
 *               - idDoctor
 *               - start
 *               - end
 *     responses:
 *       '200':
 *         description: Cita agendada correctamente
 *       '400':
 *         description: Error en la solicitud
 *       '403':
 *         description: Acceso denegado
 *       '404':
 *         description: Debes proporcionar un token
 *       '500':
 *         description: Error en el servidor
 */
citaRouter.post("/registrar", verificarAutenticacion, crearCita);

/**
 * @swagger
 * /api/citas/cancelar/{id}:
 *   put:
 *     summary: Cancelar una cita médica
 *     description: Cancelar una cita médica por su ID, con una antelación mínima de 24 horas.
 *     tags: [Citas Médicas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita médica
 *       - in: header
 *         name: issecre
 *         required: true
 *         schema:
 *           type: string
 *         description: Indica si el usuario es secretario
 *       - in: header
 *         name: ispaciente
 *         required: true
 *         schema:
 *           type: string
 *         description: Indica si el usuario tiene el rol de paciente
 *     responses:
 *       '200':
 *         description: Cita cancelada exitosamente
 *       '400':
 *         description: No puedes cancelar la cita con menos de 24 horas de antelación
 *       '401':
 *         description: Cita no encontrada
 *       '403':
 *         description: Acceso denegado
 *       '500':
 *         description: Error en el servidor
 */
citaRouter.put("/cancelar/:id", verificarAutenticacion, cancelarCita);

/**
 * @swagger
 * /api/citas/actualizar/{id}:
 *   put:
 *     summary: Editar una cita médica por ID
 *     description: Editar una cita médica existente proporcionando el ID de la cita y los campos a actualizar.
 *     tags: [Citas Médicas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita médica a editar
 *       - name: issecre
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         description: Indica si el usuario es secretario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *                 description: Nueva fecha y hora de inicio de la cita
 *               end:
 *                 type: string
 *                 format: date-time
 *                 description: Nueva fecha y hora de fin de la cita
 *               comentarios:
 *                 type: string
 *                 description: Nuevos comentarios para la cita
 *               isCancelado:
 *                 type: boolean
 *                 description: Estado de cancelación de la cita
 *     responses:
 *       '200':
 *         description: Cita médica actualizada correctamente
 *       '400':
 *         description: Error en la solicitud o usuario no autorizado
 *       '401':
 *         description: Cita no encontrada
 *       '404':
 *         description: ID de cita no válido
 *       '403':
 *         description: Acceso denegado
 *       '500':
 *         description: Error en el servidor
 */
citaRouter.put("/actualizar/:id", verificarAutenticacion, editarCita);

/**
 * @swagger
 * /api/citas/mostrar-todas:
 *   get:
 *     summary: Mostrar todas las citas médicas
 *     description: Obtiene todas las citas médicas registradas en el sistema.
 *     tags: [Citas Médicas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: issecre
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de secretario/a.
 *       - name: isdoctor
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de doctor/a.
 *       - name: ispaciente
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de paciente.
 *     responses:
 *       '200':
 *         description: Lista de todas las citas médicas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID de la cita médica
 *                       idPaciente:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID del paciente
 *                           nombre:
 *                             type: string
 *                             description: Nombre del paciente
 *                       idDoctor:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID del doctor
 *                           nombre:
 *                             type: string
 *                             description: Nombre del doctor
 *                             apellido:
 *                               type: string
 *                               description: Apellido del doctor
 *                       start:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha y hora de inicio de la cita
 *                       end:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha y hora de fin de la cita
 *                       comentarios:
 *                         type: string
 *                         description: Comentarios de la cita
 *                       isCancelado:
 *                         type: boolean
 *                         description: Estado de cancelación de la cita
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha de creación de la cita
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha de última actualización de la cita
 *                   example:
 *                     data:
 *                       - _id: "60d46f7b85c3b43d2c5bdfc6"
 *                         idPaciente:
 *                           _id: "60d46f7b85c3b43d2c5bdfc7"
 *                           nombre: "Juan Pérez"
 *                         idDoctor:
 *                           _id: "60d46f7b85c3b43d2c5bdfc8"
 *                           nombre: "Dr. Carlos"
 *                           apellido: "González"
 *                         start: "2024-06-24T10:00:00Z"
 *                         end: "2024-06-24T11:00:00Z"
 *                         comentarios: "Consulta de seguimiento"
 *                         isCancelado: false
 *                         createdAt: "2024-06-24T09:00:00Z"
 *                         updatedAt: "2024-06-24T09:30:00Z"
 *       '400':
 *         description: Error al intentar obtener las citas médicas
 *       '403':
 *         description: Acceso denegado
 *       '500':
 *         description: Error en el servidor
 */
citaRouter.get("/mostrar-todas", verificarAutenticacion, mostrarCitas);

/**
 * @swagger
 * /api/citas/mostrar/{id}:
 *   get:
 *     summary: Mostrar una cita médica por ID
 *     description: Mostrar los detalles de una cita médica específica utilizando su ID.
 *     tags: [Citas Médicas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cita médica
 *       - name: issecre
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de secretario/a.
 *       - name: isdoctor
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de doctor/a.
 *       - name: ispaciente
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de paciente.
 *     responses:
 *       '200':
 *         description: Detalles de la cita médica encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID de la cita médica
 *                 idPaciente:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID del paciente
 *                     nombre:
 *                       type: string
 *                       description: Nombre del paciente
 *                 idDoctor:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID del doctor
 *                     nombre:
 *                       type: string
 *                       description: Nombre del doctor
 *                       apellido:
 *                         type: string
 *                         description: Apellido del doctor
 *                 start:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha y hora de inicio de la cita
 *                 end:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha y hora de fin de la cita
 *                 comentarios:
 *                   type: string
 *                   description: Comentarios de la cita
 *                 isCancelado:
 *                   type: boolean
 *                   description: Estado de cancelación de la cita
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación de la cita
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de última actualización de la cita
 *               example:
 *                 _id: "60d46f7b85c3b43d2c5bdfc6"
 *                 idPaciente:
 *                   _id: "60d46f7b85c3b43d2c5bdfc7"
 *                   nombre: "Juan Pérez"
 *                 idDoctor:
 *                   _id: "60d46f7b85c3b43d2c5bdfc8"
 *                   nombre: "Dr. Carlos"
 *                   apellido: "González"
 *                 start: "2024-06-24T10:00:00Z"
 *                 end: "2024-06-24T11:00:00Z"
 *                 comentarios: "Consulta de seguimiento"
 *                 isCancelado: false
 *                 createdAt: "2024-06-24T09:00:00Z"
 *                 updatedAt: "2024-06-24T09:30:00Z"
 *       '400':
 *         description: No se encontró la cita médica solicitada
 *       '403':
 *         description: Acceso denegado
 *       '500':
 *         description: Error en el servidor
 */
citaRouter.get("/mostrar/:id", verificarAutenticacion, mostrarCitaID);

/**
 * @swagger
 * /api/citas/paciente/{id}:
 *   get:
 *     summary: Mostrar citas médicas por ID de paciente
 *     description: Mostrar todas las citas médicas registradas para un paciente específico utilizando su ID.
 *     tags: [Citas Médicas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del paciente
 *       - name: issecre
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de secretario/a.
 *       - name: isdoctor
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de doctor/a.
 *       - name: ispaciente
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de paciente.
 *     responses:
 *       '200':
 *         description: Lista de citas médicas del paciente encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de la cita médica
 *                   idDoctor:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del doctor
 *                       nombre:
 *                         type: string
 *                         description: Nombre del doctor
 *                         apellido:
 *                           type: string
 *                           description: Apellido del doctor
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de inicio de la cita
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de fin de la cita
 *                   comentarios:
 *                     type: string
 *                     description: Comentarios de la cita
 *                   isCancelado:
 *                     type: boolean
 *                     description: Estado de cancelación de la cita
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación de la cita
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de última actualización de la cita
 *                 example:
 *                   - _id: "60d46f7b85c3b43d2c5bdfc6"
 *                     idDoctor:
 *                       _id: "60d46f7b85c3b43d2c5bdfc8"
 *                       nombre: "Dr. Carlos"
 *                       apellido: "González"
 *                     start: "2024-06-24T10:00:00Z"
 *                     end: "2024-06-24T11:00:00Z"
 *                     comentarios: "Consulta de seguimiento"
 *                     isCancelado: false
 *                     createdAt: "2024-06-24T09:00:00Z"
 *                     updatedAt: "2024-06-24T09:30:00Z"
 *       '400':
 *         description: No se encontraron citas médicas para el paciente solicitado
 *       '403':
 *         description: Acceso denegado
 *       '500':
 *         description: Error en el servidor
 */
citaRouter.get(
  "/paciente/:id",
  verificarAutenticacion,
  mostrarCitasPorPaciente
);

export default citaRouter;
