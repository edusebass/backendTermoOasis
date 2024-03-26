import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";
import { emailMailRecuperarContraseña } from "../config/nodemailer.js";

const login = async(req,res)=>{
    const {email,contraseña} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBDD = await Usuario.findOne({email}).select("-__v -token -updatedAt -createdAt")
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarcontraseña = await usuarioBDD.matchContraseña(contraseña)
    if(!verificarcontraseña) return res.status(404).json({msg:"Lo sentimos, el contraseña no es el correcto"})
    const token = generarJWT(usuarioBDD._id,"usuario")
    const {nombre,apellido,_id} = usuarioBDD
    res.status(200).json({
        token,
        nombre,
        apellido,
        _id,
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

export{
    login,
    registro,
    recuperarContraseña,
    nuevaContraseña
    // perfil,
    // detalleUsuario
}