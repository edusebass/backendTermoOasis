import mongoose from "mongoose";

const DateSchema = mongoose.Schema(
  {
    dia: {
      type: Date,
      required: true,
      trim: true,
    },
    inicio: {
      type: Date,
      required: true,
    },
    fin: {
      type: Date,
      required: true,
    },
    comentarios: {
      type: String,
      required: false,
    },
    receta: {
      type: String,
      required: false,
    },
    isCancelado: { 
      type: Boolean,
      required: false,
      default: false
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
  },
  {
    timestamps: true,
  }
);

const CitaModelo = mongoose.model("Citas", DateSchema);

export default CitaModelo;
