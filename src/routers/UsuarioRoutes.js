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
} from "../controllers/UsuarioController.js";
const usuarioRouter = Router()

usuarioRouter.post("/login", login) 
usuarioRouter.post("/registro", registro) 
usuarioRouter.post("/recuperar-password", recuperarContraseña)
usuarioRouter.post("/recuperar-password-movil", recuperarContraseñaMovil) 
usuarioRouter.get("/recuperar-password/:token", comprobarTokenContraseña);
usuarioRouter.post("/nueva-password/:token", nuevaContraseña)



usuarioRouter.get("/listar-pacientes", verificarAutenticacion, obtenerPacientes)
usuarioRouter.get("/perfil", verificarAutenticacion, perfil)

export default usuarioRouter