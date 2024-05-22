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
    recuperarContraseñaMovil,
    detallePaciente,
    eliminarUsuario,
} from "../controllers/UsuarioController.js";
const usuarioRouter = Router()

usuarioRouter.post("/login", login) 
usuarioRouter.post("/registro", registro) 
usuarioRouter.post("/recuperar-password", recuperarContraseña)
usuarioRouter.get("/recuperar-password/:token", comprobarTokenContraseña);
usuarioRouter.post("/nueva-password/:token", nuevaContraseña)

usuarioRouter.post("/recuperar-password-movil", recuperarContraseñaMovil) 



usuarioRouter.get("/perfil", verificarAutenticacion, perfil)


usuarioRouter.get("/listar-pacientes", verificarAutenticacion, obtenerPacientes)
usuarioRouter.get("/detallePaciente/:id", verificarAutenticacion, detallePaciente)

usuarioRouter.delete("/eliminarUsuario/:id", verificarAutenticacion, eliminarUsuario)

export default usuarioRouter

