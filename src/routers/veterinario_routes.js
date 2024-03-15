import {Router} from 'express'
import {
    login,
    perfil,
    registro,
    confirmEmail,
    listarEspecialistas,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    detalleEspecialista,
} from "../controllers/especialista_controller.js";
import verificarAutenticacion from '../middlewares/autenticacion.js';
import { validacionEspecialista } from '../middlewares/validacionEspecialista.js';
//Crear una instancia de Router()
const router = Router()

//Definimos las rutas
//rutas publicas
router.post("/login", login);

router.post("/registro", validacionEspecialista, registro);

router.get("/confirmar/:token", confirmEmail);
router.get("/veterinarios", listarEspecialistas);
router.post("/recuperar-password", recuperarPassword);
router.post("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

//rutas privadas
router.get("/perfil", verificarAutenticacion, perfil);
router.put('/veterinario/actualizarpassword', verificarAutenticacion, actualizarPassword)
router.get("/veterinario/:id", verificarAutenticacion, detalleEspecialista);
router.put("/veterinario/:id", verificarAutenticacion, actualizarPerfil);

export default router