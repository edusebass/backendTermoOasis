import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";
import { emailMailRecuperarContraseña, emailMailRecuperarContraseñaMovil } from "../config/nodemailer.js";
import UsuarioModelo from "../models/Usuario.js";
import { generateRandomPassword } from "../helpers/generadorContraseña.js";

const login = async(req,res)=>{
    const {email,contraseña} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBDD = await Usuario.findOne({email}).select("-__v -token -updatedAt -createdAt -citas -pacientes")
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarcontraseña = await usuarioBDD.matchContraseña(contraseña)
    if(!verificarcontraseña) return res.status(404).json({msg:"Lo sentimos, la contraseña no es la correcta"})
    const token = generarJWT(usuarioBDD._id,"usuario")
    const {nombre,apellido, _id, isPaciente, isDoctor, isSecre, fechaNacimiento, lugarNacimiento, estadoCivil, direccion, telefono, cedula} = usuarioBDD
    res.status(200).json({
        token,
        nombre,
        apellido,
        _id,
        isDoctor,
        isPaciente,
        isSecre,
        fechaNacimiento,
        lugarNacimiento,
        estadoCivil,
        direccion,
        telefono,
        cedula,
        email:usuarioBDD.email
    })
}

const registro =async (req,res)=>{
    // Desestructura los campos
    const {email,contraseña} = req.body
    // Validar todos los campos llenos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Obtener el usuario de la BDD en base al email
    const verificarEmailBDD = await Usuario.findOne({email})
    // Validar que el email sea nuevo
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    // Crear una instancia del Usuario
    const nuevoUsuario = new Usuario(req.body)
    // Encriptar el contraseña
    nuevoUsuario.contraseña = await nuevoUsuario.encrypContraseña(contraseña)
    // Guardar en base de datos
    await nuevoUsuario.save()
    // Responder
    res.status(200).json({msg:"Usuario registrado"})
}

const recuperarContraseña = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Verifica si existe el usuario
    const usuarioBDD = await Usuario.findOne({email})
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    // si existe envia el email
    const token = usuarioBDD.crearToken()
    usuarioBDD.token = token
    await emailMailRecuperarContraseña(email, token)
    await usuarioBDD.save()
    res.status(200).json({
        msg:"Revisa tu correo electrónico para restablecer tu contraseña",
        tokenContraseña: usuarioBDD.token
    })
}

const comprobarTokenContraseña = async (req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const usuarioBDD = await UsuarioModelo.findOne({token:req.params.token})
    if(usuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await usuarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

const nuevaContraseña = async (req,res)=>{
    const{contraseña, confirmContraseña} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(contraseña != confirmContraseña) return res.status(404).json({msg:"Lo sentimos, los contraseñas no coinciden"})

    const usuarioBDD = await Usuario.findOne({token:req.params.token})
    if(usuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    usuarioBDD.token = null
    usuarioBDD.contraseña = await usuarioBDD.encrypContraseña(contraseña)
    await usuarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo contraseña"}) 
}

const obtenerPacientes = async (req, res) => {
    try {
      const pacientes = await UsuarioModelo.find({ isPaciente: true })
      
      res.status(200).json({ data: pacientes, status: true });
    } catch (error) {
      res.status(400).json({ msg: error.message, status: false });
    }
};

const perfil =(req,res)=>{
    delete req.usuarioBDD.token
    delete req.usuarioBDD.createdAt
    delete req.usuarioBDD.updatedAt
    delete req.usuarioBDD.__v
    res.status(200).json(req.usuarioBDD)
}

const recuperarContraseñaMovil = async (req, res) => {
    const { nombre, apellido, email } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Verifica si existe el usuario
    const usuarioBDD = await Usuario.findOne({ nombre, apellido, email });

    if (!usuarioBDD) {
        return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }

    // si existe, envía el email
    const nuevaContraseña = generateRandomPassword();

    await emailMailRecuperarContraseñaMovil(email, nuevaContraseña);
    usuarioBDD.contraseña = await usuarioBDD.encrypContraseña(nuevaContraseña);
    await usuarioBDD.save();

    res.status(200).json({ msg: "Se envió tu nueva contraseña al correo registrado del usuario" });
}

const detallePaciente = async(req, res) => {
    const { id } = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos no existe el paciente ${id}`});
    const paciente = await Usuario.findById(id).select("-createdAt -updatedAt -__v")
    res.status(200).json({paciente})
}

const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el usuario con ID ${id}` });
    }
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
        return res.status(404).json({ msg: `Lo sentimos, no se pudo encontrar el usuario con ID ${id}` });
    }
    res.status(200).json({ msg: 'Usuario eliminado exitosamente', usuarioEliminado });
};

export{
    login,
    registro,
    recuperarContraseña,
    nuevaContraseña,
    perfil,
    comprobarTokenContraseña,
    recuperarContraseñaMovil,
    detallePaciente,
    obtenerPacientes,
    eliminarUsuario,
}