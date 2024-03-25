import {Schema, model } from 'mongoose'
import mongoose from 'mongoose'
import bcrypt from "bcryptjs";

const UsuarioSchema = new Schema(
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
    contraseña: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
    citas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dates",
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

UsuarioSchema.methods.encrypContraseña = async function(contraseña){
    const salt = await bcrypt.genSalt(10)
    const contrasenaEncryp = await bcrypt.hash(contraseña, salt)
    return contrasenaEncryp
}

// Método para verificar si el Contrasena ingresado es el mismo de la BDD
UsuarioSchema.methods.matchContraseña = async function(contraseña){
    const response = await bcrypt.compare(contraseña, this.contraseña)
    return response
}

export default model('Usuario', UsuarioSchema)