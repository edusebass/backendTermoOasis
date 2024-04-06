import mongoose from "mongoose";

const RegistroSchema = mongoose.Schema(
  {
    iddate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citas",
      required: true,
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
    receta: [
      {
        nombre: {
          type: String,
          trim: true,
        },
        dosis: {
          type: String,
          trim: true,
        },
        frecuencia: {
          type: String,
          trim: true,
        },
      },
    ],
    dieta: [
      {
        descripcion: {
          type: String,
          trim: true,
        },
      },
    ],
    actividad: [
      {
        descripcion: {
          type: String,
          trim: true,
        },
      },
    ],
    cuidados: [
      {
        descripcion: {
          type: String,
          trim: true,
        },
      },
    ],
    generalInfo: {
      fechaNacimiento: {
        type: Date,
        trim: true,
      },
      lugarNacimiento: {
        type: String,
        trim: true,
      },
      cedula: {
        type: String,
        trim: true,
      },
      estadoCivil: {
        type: String,
        trim: true,
      },
      ocupacion: {
        type: String,
        trim: true,
      }
    },
    contactInfo: {
      direccion: {
        type: String,
        trim: true,
      },
      telefono: {
        type: Number,
        trim: true,
      },
    },
    informacionMedica: {
      altura: {
        type: Number,
        trim: true,
      },
      peso: {
        type: Number,
        trim: true,
      },
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model("Registro", RegistroSchema);

export default Record;
