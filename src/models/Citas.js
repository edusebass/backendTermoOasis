import mongoose from "mongoose";

const DateSchema = mongoose.Schema(
  {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    comentarios: {
      type: String,
      required: false,
    },
    isCancelado: { 
      type: Boolean,
      required: false,
      default: false
    },
    registroMedico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registro",
      required: false,
    },
    idPaciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },
    idDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },
    recordatory: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const CitaModelo = mongoose.model("Citas", DateSchema);

export default CitaModelo;
