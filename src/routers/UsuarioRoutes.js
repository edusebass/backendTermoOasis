import { Router } from 'express'
import verificarAutenticacion from '../middlewares/autenticacion.js'
import{
    login,
    registro,
    recuperarContraseña,
    nuevaContraseña,
    obtenerPacientes,
    perfil,
    comprobarTokenContraseña,
} from "../controllers/UsuarioController.js";
const usuarioRouter = Router()

usuarioRouter.post("/login", login) //endpoint para el login
usuarioRouter.post("/registro", registro) //enpoint para el registro
usuarioRouter.post("/recuperar-password", recuperarContraseña) //endpoint para enviar el email y que te llegue el correo para recuperar contraseña
usuarioRouter.get("/recuperar-password/:token", comprobarTokenContraseña);
usuarioRouter.post("/nueva-password/:token", nuevaContraseña)
usuarioRouter.get("/listar-pacientes", verificarAutenticacion, obtenerPacientes)
usuarioRouter.get("/perfil", verificarAutenticacion, perfil)

export default usuarioRouter