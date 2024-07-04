import mongoose from 'mongoose'
import bcrypt from "bcryptjs";

const UsuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    cedula : {
      type: String,
      trim: true,
    },
    isDoctor: {
      type: Boolean,
      trim: true,
      default: false,
    },
    isPaciente: {
      type: Boolean,
      trim: true,
      default: false,
    },
    isSecre: {
      type: Boolean,
      trim: true,
      default: false,
    },
    fechaNacimiento: {
      type: Date,
      trim: true,
    },
    lugarNacimiento: {
      type: String,
      trim: true,
    },
    estadoCivil: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    telefono: {
      type: Number,
      trim: true,
    },
    citas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Citas",
      },
    ],
    pacientes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
      },
    ],
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UsuarioSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const contrasenaEncryp = await bcrypt.hash(password, salt)
    return contrasenaEncryp
}

// Método para verificar si el Contrasena ingresado es el mismo de la BDD
UsuarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password, this.password)
    return response
}

UsuarioSchema.methods.crearToken = function(){
  const tokenGenerado = this.token = Math.random().toString(36).slice(2)
  return tokenGenerado
}
const UsuarioModelo = mongoose.model("Usuarios", UsuarioSchema)
export default UsuarioModelo