import  { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import Especialista from "../models/Especialista.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose"

const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const especialistaBDD = await Especialista.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    if(especialistaBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    if(!especialistaBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await especialistaBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})

    //generamos el web token
    const token = generarJWT(especialistaBDD._id, "especialista")

    const {nombre,apellido,direccion,telefono,_id} = especialistaBDD
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:especialistaBDD.email
    })
}

const perfil =(req,res)=>{
    delete req.especialistaBDD.token
    delete req.especialistaBDD.confirmEmail
    delete req.especialistaBDD.createdAt
    delete req.especialistaBDD.updatedAt
    delete req.especialistaBDD.__v
    res.status(200).json(req.especialistaBDD)
}

//Metodo para registrar 
const registro = async (req,res)=>{
    //Desestructura los campos
    const {email,password} = req.body
    // Validar todos los campos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    //Obtener el usuario de la BD en base al email
    const verificarEmailBDD = await Especialista.findOne({email})
    //Validar que el email sea nuevo
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    //Creando la nuevva instancia del Especialista
    const nuevoEspecialista = new Especialista(req.body)
    //Encryptar el password
    nuevoEspecialista.password = await nuevoEspecialista.encrypPassword(password)


    //Crear el token => mail
    const token = nuevoEspecialista.crearToken()
    //enviar email
    await sendMailToUser(email, token)
    //Guarda en una BD
    await nuevoEspecialista.save()
    //Responder
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

const confirmEmail = async (req,res)=>{
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const especialistaBDD = await Especialista.findOne({token:req.params.token})
    if(!especialistaBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    especialistaBDD.token = null
    especialistaBDD.confirmEmail=true
    await especialistaBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

const listarEspecialistas = (req,res)=>{
    res.status(200).json({res:'lista de Especialistas registrados'})
}

const detalleEspecialista = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const especialistaBDD = await Especialista.findById(id).select("-password")
    if(!especialistaBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Especialista ${id}`})
    res.status(200).json({msg:especialistaBDD})
}

const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const especialistaBDD = await Especialista.findById(id)
    if(!especialistaBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Especialista ${id}`})
    if (especialistaBDD.email !=  req.body.email)
    {
        const especialistaBDDMail = await Especialista.findOne({email:req.body.email})
        if (especialistaBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
    especialistaBDD.nombre = req.body.nombre || especialistaBDD?.nombre
    especialistaBDD.apellido = req.body.apellido  || especialistaBDD?.apellido
    especialistaBDD.direccion = req.body.direccion ||  especialistaBDD?.direccion
    especialistaBDD.telefono = req.body.telefono || especialistaBDD?.telefono
    especialistaBDD.email = req.body.email || especialistaBDD?.email
    await especialistaBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}

const actualizarPassword = async (req,res)=>{
    const especialistaBDD = await Especialista.findById(req.especialistaBDD._id)
    if(!especialistaBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Especialista ${id}`})
    const verificarPassword = await especialistaBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    especialistaBDD.password = await especialistaBDD.encrypPassword(req.body.passwordnuevo)
    await especialistaBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const especialistaBDD = await Especialista.findOne({email})
    if(!especialistaBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const token = especialistaBDD.crearToken()
    especialistaBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await especialistaBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}

const comprobarTokenPasword = async (req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const especialistaBDD = await Especialista.findOne({token:req.params.token})
    if(especialistaBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await especialistaBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}
const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const especialistaBDD = await Especialista.findOne({token:req.params.token})
    if(especialistaBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    especialistaBDD.token = null
    especialistaBDD.password = await especialistaBDD.encrypPassword(password)
    await especialistaBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}

export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarEspecialistas,
    detalleEspecialista,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}