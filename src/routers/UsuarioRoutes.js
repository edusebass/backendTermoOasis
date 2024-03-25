import {Router} from 'express'
// import verificarAutenticacion from '../middlewares/autenticacion.js'

const router = Router()
import{
    login,
    registro
    // detalleUsuario,
    // perfil,
} from "../controllers/UsuarioController.js";

router.post("/login", login)

router.post("/registro", registro)

// router.get("/perfil", verificarAutenticacion, perfil)

// router.get('/usuario/:id',verificarAutenticacion, detalleUsuario)

export default router