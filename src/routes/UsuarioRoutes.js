import { Router } from "express";
import verificarAutenticacion from "../middlewares/autenticacion.js";
import {
  login,
  registro,
  recuperarPassword,
  nuevaPassword,
  obtenerPacientes,
  perfil,
  comprobarTokenPassword,
  recuperarPasswordMovil,
  detallePaciente,
  eliminarUsuario,
} from "../controllers/UsuarioController.js";
const usuarioRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints relacionados con los usuarios

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Permite a un usuario iniciar sesión proporcionando su email y password.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT de autenticación
 *                 nombre:
 *                   type: string
 *                   description: Nombre del usuario
 *                 apellido:
 *                   type: string
 *                   description: Apellido del usuario
 *                 _id:
 *                   type: string
 *                   description: ID del usuario
 *                 isDoctor:
 *                   type: boolean
 *                   description: Indica si el usuario es un doctor
 *                 isPaciente:
 *                   type: boolean
 *                   description: Indica si el usuario es un paciente
 *                 isSecre:
 *                   type: boolean
 *                   description: Indica si el usuario es un secre
 *                 fechaNacimiento:
 *                   type: string
 *                   format: date
 *                   description: Fecha de nacimiento del usuario
 *                 lugarNacimiento:
 *                   type: string
 *                   description: Lugar de nacimiento del usuario
 *                 estadoCivil:
 *                   type: string
 *                   description: Estado civil del usuario
 *                 direccion:
 *                   type: string
 *                   description: Dirección del usuario
 *                 telefono:
 *                   type: string
 *                   description: Número de teléfono del usuario
 *                 cedula:
 *                   type: string
 *                   description: Número de cédula del usuario
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email del usuario
 *       400:
 *         description: Error al intentar iniciar sesión
 *       404:
 *         description: Usuario no encontrado o password incorrecta
 *       500:
 *         description: Error en el servidor
 */
usuarioRouter.post("/login", login);

/**
 * @swagger
 * /api/registro:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Permite registrar un nuevo usuario con email y password.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               nombre:
 *                 type: string
 *                 example: Nombre
 *               apellido:
 *                 type: string
 *                 example: Apellido
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               lugarNacimiento:
 *                 type: string
 *                 example: Ciudad, País
 *               estadoCivil:
 *                 type: string
 *                 example: Soltero/a
 *               direccion:
 *                 type: string
 *                 example: Calle 123
 *               telefono:
 *                 type: string
 *                 example: "+1234567890"
 *               cedula:
 *                 type: string
 *                 example: "1234567890"
 *               isPaciente:
 *                 type: boolean
 *                 example: true
 *               isDoctor:
 *                  type: boolean
 *                  example: false
 *               isSecre:
 *                  type: boolean
 *                  example: false
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Mensaje de confirmación
 *       400:
 *         description: Error al intentar registrar usuario
 *       500:
 *         description: Error en el servidor
 */
usuarioRouter.post("/registro", registro);

/**
 * @swagger
 * /api/recuperar-password:
 *   post:
 *     summary: Recuperar password frontend
 *     description: Permite solicitar la recuperación de password mediante el envío de un correo electrónico.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: usuario@example.com
 *     responses:
 *       200:
 *         description: Se ha enviado un correo electrónico para restablecer la password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 tokenPassword:
 *                   type: string
 *       404:
 *         description: Error si algún campo está vacío,el usuario no está registrado o formato de correo no valido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
usuarioRouter.post("/recuperar-password", recuperarPassword);

/**
 * @swagger
 * /api/recuperar-password/{token}:
 *   get:
 *     summary: Comprobar token de recuperación de password
 *     description: Verifica si el token proporcionado es válido para restablecer la password del usuario.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de recuperación de password recibido por correo electrónico.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token confirmado, el usuario puede crear su nueva password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       404:
 *         description: Error si el token no es válido o no se puede validar la cuenta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
usuarioRouter.get("/recuperar-password/:token", comprobarTokenPassword);

/**
 * @swagger
 * /api/nueva-password/{token}:
 *   post:
 *     summary: Restablecer password con token de recuperación
 *     description: Permite al usuario restablecer su password utilizando el token de recuperación recibido por correo electrónico.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de recuperación de password recibido por correo electrónico.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             example:
 *               password: qweasdzxc123.
 *               confirmPassword: qweasdzxc123.
 *     responses:
 *       200:
 *         description: password restablecida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       404:
 *         description: Error si el token no es válido o no se puede validar la cuenta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
usuarioRouter.post("/nueva-password/:token", nuevaPassword);

/**
 * @swagger
 * /api/recuperar-password-movil:
 *   post:
 *     summary: Recuperar password para móvil
 *     description: Permite al usuario recuperar su password utilizando su nombre, apellido y correo electrónico registrados.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - email
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Se envió la nueva password al correo registrado del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       404:
 *         description: Error si algún campo está vacío o el usuario no está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
usuarioRouter.post("/recuperar-password-movil", recuperarPasswordMovil);

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Obtener perfil de usuario
 *     description: Obtiene la información del perfil del usuario autenticado.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del perfil del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 isDoctor:
 *                   type: boolean
 *                 isPaciente:
 *                   type: boolean
 *                 isSecre:
 *                   type: boolean
 *                 fechaNacimiento:
 *                   type: string
 *                 lugarNacimiento:
 *                   type: string
 *                 estadoCivil:
 *                   type: string
 *                 direccion:
 *                   type: string
 *                 telefono:
 *                   type: string
 *                 cedula:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: No autorizado, el usuario debe iniciar sesión.
 *       403:
 *         description: Acceso prohibido, el token proporcionado no es válido o ha expirado.
 */
usuarioRouter.get("/perfil", verificarAutenticacion, perfil);

/**
 * @swagger
 * /api/listar-pacientes:
 *   get:
 *     summary: Listar pacientes
 *     description: Obtiene la lista de todos los pacientes registrados en el sistema.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: header
 *         name: issecre
 *         required: true
 *         schema:
 *           type: string
 *         description: Indica si el usuario es secretario (true o false)
 *       - name: isdoctor
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de doctor (true o false).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida correctamente.
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
 *                       nombre:
 *                         type: string
 *                       apellido:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fechaNacimiento:
 *                         type: string
 *                       direccion:
 *                         type: string
 *                       telefono:
 *                         type: string
 *                       cedula:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                       __v:
 *                         type: number
 *                       isDoctor:
 *                         type: boolean
 *                       isPaciente:
 *                         type: boolean
 *                       isSecre:
 *                         type: boolean
 *                       estadoCivil:
 *                         type: string
 *                       lugarNacimiento:
 *                         type: string
 *       401:
 *         description: No autorizado, el usuario debe iniciar sesión.
 *       403:
 *         description: Acceso denegado.
 *       400:
 *         description: Error al intentar obtener la lista de pacientes.
 */
usuarioRouter.get(
  "/listar-pacientes",
  verificarAutenticacion,
  obtenerPacientes
);

/**
 * @swagger
 * /api/detallePaciente/{id}:
 *   get:
 *     summary: Detalle de paciente
 *     description: Obtiene los detalles de un paciente específico por su ID.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del paciente a consultar.
 *       - name: issecre
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de secretario (true o false).
 *       - name: isdoctor
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de doctor (true o false).
 *       - name: ispaciente
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de paciente (true o false).
 *     responses:
 *       200:
 *         description: Detalles del paciente obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paciente:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     apellido:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fechaNacimiento:
 *                       type: string
 *                     direccion:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     cedula:
 *                       type: string
 *                     isDoctor:
 *                       type: boolean
 *                     isPaciente:
 *                       type: boolean
 *                     isSecre:
 *                       type: boolean
 *                     estadoCivil:
 *                       type: string
 *                     lugarNacimiento:
 *                       type: string
 *       401:
 *         description: No autorizado, el usuario debe iniciar sesión.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: No se encontró ningún paciente con el ID proporcionado.
 *       400:
 *         description: Error al intentar obtener los detalles del paciente.
 */
usuarioRouter.get(
  "/detallePaciente/:id",
  verificarAutenticacion,
  detallePaciente
);

/**
 * @swagger
 * /api/eliminarUsuario/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: Elimina un usuario específico por su ID.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar.
 *       - name: issecre
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: Indica si el usuario tiene el rol de secretario (true o false).
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario eliminado correctamente
 *                 status:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: No autorizado, el usuario debe iniciar sesión.
 *       403:
 *         description: Acceso prohibido, el token proporcionado no es válido o ha expirado.
 *       404:
 *         description: No se encontró ningún usuario con el ID proporcionado.
 *       400:
 *         description: Error al intentar eliminar el usuario.
 */
usuarioRouter.delete(
  "/eliminarUsuario/:id",
  verificarAutenticacion,
  eliminarUsuario
);

export default usuarioRouter;
