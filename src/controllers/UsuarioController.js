import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";

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

export{
    login,
    registro,
    // perfil,
    // detalleUsuario
}