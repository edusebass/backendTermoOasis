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
} from "../controllers/UsuarioController.js";
const usuarioRouter = Router()

usuarioRouter.post("/login", login) 
usuarioRouter.post("/registro", registro) 
usuarioRouter.post("/recuperar-password", recuperarContraseña)
usuarioRouter.get("/recuperar-password/:token", comprobarTokenContraseña);
usuarioRouter.post("/nueva-password/:token", nuevaContraseña)

usuarioRouter.post("/recuperar-password-movil", recuperarContraseñaMovil) 



usuarioRouter.get("/listar-pacientes", verificarAutenticacion, obtenerPacientes)
usuarioRouter.get("/perfil", verificarAutenticacion, perfil)


usuarioRouter.get("/detallePaciente/:id", verificarAutenticacion, detallePaciente)

export default usuarioRouter