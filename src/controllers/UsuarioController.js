import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";
import { emailMailRecuperarPassword, emailMailRecuperarPasswordMovil } from "../config/nodemailer.js";
import UsuarioModelo from "../models/Usuario.js";
import { generateRandomPassword } from "../helpers/generadorPassword.js";
import { validarPassword } from "../utils/validarPassword.js";

const validarFechaNacimiento = (fecha) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) {
        return false;
    }

    const date = new Date(fecha);
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return false;
    }

    return fecha === date.toISOString().split('T')[0];
};
const validarTelefono = (telefono) => {
    const regex = /^09\d{8}$/;
    return regex.test(telefono);
};

const validarCedula = (cedula) => {
    const regex = /^\d{1,10}$/;
    return regex.test(cedula);
};

const validarBooleano = (valor) => {
    if (typeof valor === 'string') {
        valor = valor.toLowerCase();
        return valor === 'true' || valor === 'false';
    }
    return typeof valor === 'boolean';
};

const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function validarNombreApellido(campo) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(campo);
}

const registro = async (req,res)=>{
    try {
        const {nombre, apellido, email,password, fechaNacimiento, telefono, cedula, isPaciente, isDoctor, isSecre } = req.body

        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        if (!validarPassword(password)) {
            return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres, contener al menos una letra mayúscula, un número y un carácter especial" });
        }

        if (!validarNombreApellido(nombre)) {
            return res.status(400).json({ msg: "El nombre no debe contener números" });
        }
        
        if (!validarNombreApellido(apellido)) {
            return res.status(400).json({ msg: "El apellido no debe contener números" });
        }

        if (!validarEmail(email)) {
            return res.status(400).json({ msg: "El formato del email es inválido" });
        }

        const verificarEmailBDD = await Usuario.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        if (!validarFechaNacimiento(fechaNacimiento)) {
            return res.status(400).json({ msg: "La fecha de nacimiento debe estar en el formato YYYY-MM-DD y ser una fecha válida" });
        }

        if (!validarTelefono(telefono)) {
            return res.status(400).json({ msg: "El número de teléfono debe comenzar con 09 y tener un total de 10 dígitos" });
        }

        if (!validarCedula(cedula)) {
            return res.status(400).json({ msg: "La cédula debe contener solo números" });
        }

        if (!validarBooleano(isPaciente) || !validarBooleano(isDoctor) || !validarBooleano(isSecre)) {
            return res.status(400).json({ msg: "Los campos isPaciente, isDoctor e isSecre deben ser booleanos" });
        }

        // Verificar campos booleanos
    const booleanFields = { isPaciente, isDoctor, isSecre };
    const invalidBooleanFields = Object.keys(booleanFields).filter(key => typeof booleanFields[key] !== 'boolean');

    if (invalidBooleanFields.length > 0) {
        return res.status(400).json({ msg: `Los campos ${invalidBooleanFields.join(', ')} deben ser valores booleanos (true o false)` });
    }

        const nuevoUsuario = new Usuario(req.body)
        nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)
        await nuevoUsuario.save()
        res.status(200).json({msg:"Usuario registrado"})
    } catch (error) {
        console.error("Error en la solicitud:", error);
        res.status(400).json({ msg: "Error en la solicitud", error: error.message });
    }
}
const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if (!validarEmail(email)) {
        return res.status(400).json({ msg: "El formato del email es inválido" });
    }
    const usuarioBDD = await Usuario.findOne({email})
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarcontraseña = await usuarioBDD.matchPassword(password)
    if(!verificarcontraseña) return res.status(404).json({msg:"Lo sentimos, la password no es la correcta"})
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

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBDD = await Usuario.findOne({email})
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado o formato de correo incorrecto"})
    const token = usuarioBDD.crearToken()
    usuarioBDD.token = token
    await emailMailRecuperarPassword(email, token)
    await usuarioBDD.save()
    res.status(200).json({
        msg:"Revisa tu correo electrónico para restablecer tu password",
        tokenPassword: usuarioBDD.token
    })
}

const comprobarTokenPassword = async (req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const usuarioBDD = await UsuarioModelo.findOne({token:req.params.token})
    if(usuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await usuarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

const nuevaPassword = async (req,res)=>{
    const{password, confirmPassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmPassword) return res.status(404).json({msg:"Lo sentimos, los contraseñas no coinciden"})
    if(!validarPassword(password)) return res.status(404).json({msg:"La contrasena debe tener al menos 6 caracteres, numeros y maysuculas"})
    const usuarioBDD = await Usuario.findOne({token:req.params.token})
    if(usuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    usuarioBDD.token = null
    usuarioBDD.password = await usuarioBDD.encrypPassword(password)
    await usuarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}

const recuperarPasswordMovil = async (req, res) => {
    const { nombre, apellido, email } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    if(!validarEmail(email)) {
        return res.status(400).json({ msg: "El formato del email es inválido" });
    }

    const usuarioBDD = await Usuario.findOne({ nombre, apellido, email });

    if (!usuarioBDD) {
        return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }

    const nuevaPassword = generateRandomPassword();

    await emailMailRecuperarPasswordMovil(email, nuevaPassword);
    usuarioBDD.password = await usuarioBDD.encrypPassword(nuevaPassword);
    await usuarioBDD.save();

    res.status(200).json({ msg: "Se envió tu nueva password al correo registrado del usuario" });
}

const obtenerPacientes = async (req, res) => {
    const isSecre = req.headers['issecre'] === 'true';
    const isDoctor = req.headers['isdoctor'] === 'true';

    if (!isSecre && !isDoctor) {
        return res.status(403).json({ msg: "Acceso denegado", status: false });
    }
    try {
        const pacientes = await UsuarioModelo.find({ isPaciente: true }).select('-password');
        
        res.status(200).json({ data: pacientes, status: true });
    } catch (error) {
        res.status(400).json({ msg: error.message, status: false });
    }
};


const eliminarUsuario = async (req, res) => {
    const isSecre = req.headers['issecre'] === 'true';

    if (!isSecre) {
        return res.status(403).json({ msg: "Acceso denegado", status: false });
    }
    
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

const detallePaciente = async(req, res) => {
    const isSecre = req.headers['issecre'] === 'true';
    const isDoctor = req.headers['isdoctor'] === 'true';
    const isPaciente = req.headers['ispaciente'] === 'true';
  
    if (!isSecre && !isDoctor && !isPaciente) {
        return res.status(403).json({ msg: "Acceso denegado", status: false });
    }

    const { id } = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos no existe el paciente ${id}`});
    const paciente = await Usuario.findById(id).select("-createdAt -updatedAt -__v")
    res.status(200).json({paciente})
}

const perfil =(req,res)=>{
    delete req.usuarioBDD.token
    delete req.usuarioBDD.createdAt
    delete req.usuarioBDD.updatedAt
    delete req.usuarioBDD.__v
    res.status(200).json(req.usuarioBDD)
}

export{
    login,
    registro,
    recuperarPassword,
    nuevaPassword,
    perfil,
    comprobarTokenPassword,
    recuperarPasswordMovil,
    detallePaciente,
    obtenerPacientes,
    eliminarUsuario,
}