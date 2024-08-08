import UsuarioModelo from "../models/Usuario.js";
import CitaModelo from "../models/Citas.js";
import RegistroMedicoModelo from "../models/RegistroMedico.js";
import mongoose from "mongoose";

const crearRegistro = async (req, res) => {
  const { idPaciente, idDoctor, idCita, receta, dieta, actividad, cuidados, informacionMedica, comments } = req.body;

  const isDoctor = req.headers['isdoctor'] === 'true';

  if (!isDoctor) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }

  try {
    // Verificar si los IDs son válidos
    if (!mongoose.Types.ObjectId.isValid(idPaciente) || !mongoose.Types.ObjectId.isValid(idDoctor) || !mongoose.Types.ObjectId.isValid(idCita)) {
      return res.status(400).json({ msg: "Uno o más IDs proporcionados no son válidos", status: false });
    }

    
    // Verificar longitud de cadenas
    if (dieta && dieta.length > 20) {
      return res.status(400).json({ msg: "La dieta no debe exceder los 20 caracteres", status: false });
    }

    if (actividad && actividad.length > 20) {
      return res.status(400).json({ msg: "La actividad no debe exceder los 20 caracteres", status: false });
    }

    if (cuidados && cuidados.length > 20) {
      return res.status(400).json({ msg: "Los cuidados no deben exceder los 20 caracteres", status: false });
    }

    if (comments && comments.length > 20) {
      return res.status(400).json({ msg: "Los comentarios no deben exceder los 20 caracteres", status: false });
    }

    // Verificar información médica
    if (Array.isArray(receta)) {
      for (const item of receta) {
        if (item.nombre && item.nombre.length > 20) {
          return res.status(400).json({ msg: "El nombre en la receta no debe exceder los 20 caracteres", status: false });
        }

        if (item.dosis && item.dosis.length > 20) {
          return res.status(400).json({ msg: "La dosis en la receta no debe exceder los 20 caracteres", status: false });
        }

        if (item.frecuencia && item.frecuencia.length > 20) {
          return res.status(400).json({ msg: "La frecuencia en la receta no debe exceder los 20 caracteres", status: false });
        }
      }
    }else {
      return res.status(400).json({ msg: "La receta debe ser un arreglo", status: false });
    }

    if (informacionMedica && Array.isArray(informacionMedica)) {
      const { altura, peso } = informacionMedica;

      if (typeof altura !== 'number' || typeof peso !== 'number') {
        return res.status(400).json({ msg: "La altura y el peso deben ser números", status: false });
      }

      // Verificar que sean decimales con una sola cifra decimal
      if (!/^(\d+(\.\d{2})?)$/.test(altura) || !/^(\d+(\.\d{2})?)$/.test(peso)) {
        return res.status(400).json({ msg: "La altura y el peso deben ser números decimales con dos cifras decimales", status: false });
      }
    }

    // Verificar existencia de paciente, doctor y cita
    const existPaciente = await UsuarioModelo.findById(idPaciente);
    const existDoctor = await UsuarioModelo.findById(idDoctor);
    const existCita = await CitaModelo.findById(idCita);

    if (!existPaciente || !existPaciente.isPaciente) {
      return res.status(400).json({ msg: "Paciente no registrado", status: false });
    }

    if (!existDoctor || !existDoctor.isDoctor) {
      return res.status(400).json({ msg: "Especialista no registrado", status: false });
    }

    if (!existCita) {
      return res.status(400).json({ msg: "Cita no registrada", status: false });
    }

    // Verificar si la cita ya tiene un registro médico asociado
    if (existCita.registroMedico) {
      return res.status(400).json({ msg: "Ya existe un registro médico para esta cita", status: false });
    }

    const registro = new RegistroMedicoModelo(req.body);

    await registro.save();

    existCita.registroMedico = registro._id;
    await existCita.save();

    res.status(200).json({ msg: "Registro médico creado correctamente", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};

const obtenerRegistroPaciente = async (req, res) => {
  const { id } = req.params;
  const isDoctor = req.headers['isdoctor'] === 'true';
  const isSecre = req.headers['issecre'] === 'true';

 // Verificar si los IDs son válidos
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID proporcionado no es válido para mongoDB", status: false });
  }

  if (!isDoctor && !isSecre) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }
  
  try {
    const registroMedico = await RegistroMedicoModelo.findOne({ idCita: id });

    if (!registroMedico) {
      return res.status(404).json({ msg: "Registro de la cita no encontrado" });
    }

    res.status(200).json({ data: registroMedico, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const editarRegistro = async (req, res) => {
  const { id } = req.params;

  const isDoctor = req.headers['isdoctor'] === 'true';

  const { receta, dieta, actividad, cuidados, informacionMedica, comments } = req.body;


  if (!isDoctor ) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }

  try {

    // Verificar si los IDs son válidos
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID proporcionado no es válido para mongoDB", status: false });
    }

    
    // Verificar longitud de cadenas
    if (dieta && dieta.length > 20) {
      return res.status(400).json({ msg: "La dieta no debe exceder los 20 caracteres", status: false });
    }

    if (actividad && actividad.length > 20) {
      return res.status(400).json({ msg: "La actividad no debe exceder los 20 caracteres", status: false });
    }

    if (cuidados && cuidados.length > 20) {
      return res.status(400).json({ msg: "Los cuidados no deben exceder los 20 caracteres", status: false });
    }

    if (comments && comments.length > 20) {
      return res.status(400).json({ msg: "Los comentarios no deben exceder los 20 caracteres", status: false });
    }

    // Verificar información médica
    if (Array.isArray(receta)) {
      for (const item of receta) {
        if (item.nombre && item.nombre.length > 20) {
          return res.status(400).json({ msg: "El nombre en la receta no debe exceder los 20 caracteres", status: false });
        }

        if (item.dosis && item.dosis.length > 20) {
          return res.status(400).json({ msg: "La dosis en la receta no debe exceder los 20 caracteres", status: false });
        }

        if (item.frecuencia && item.frecuencia.length > 20) {
          return res.status(400).json({ msg: "La frecuencia en la receta no debe exceder los 20 caracteres", status: false });
        }
      }
    }else {
      return res.status(400).json({ msg: "La receta debe ser un arreglo", status: false });
    }

    if (informacionMedica && Array.isArray(informacionMedica)) {
      const { altura, peso } = informacionMedica;

      if (typeof altura !== 'number' || typeof peso !== 'number') {
        return res.status(400).json({ msg: "La altura y el peso deben ser números", status: false });
      }

      // Verificar que sean decimales con una sola cifra decimal
      if (!/^(\d+(\.\d{2})?)$/.test(altura) || !/^(\d+(\.\d{2})?)$/.test(peso)) {
        return res.status(400).json({ msg: "La altura y el peso deben ser números decimales con dos cifras decimales", status: false });
      }
    }
    // Buscar el registro médico por su ID
    const registro = await RegistroMedicoModelo.findById(id);

    if (!registro) {
      // Si no se encuentra el registro, devolver un error
      return res.status(404).json({ msg: "Registro no encontrado" });
    }

    // Actualizar la receta si se proporciona en req.body
    if (req.body.receta) {
      registro.receta = req.body.receta;
    }

    // Actualizar otros campos del registro si se proporcionan en req.body
    registro.dieta = req.body.dieta || registro.dieta;
    registro.actividad = req.body.actividad || registro.actividad;
    registro.cuidados = req.body.cuidados || registro.cuidados;
    registro.informacionMedica = req.body.informacionMedica || registro.informacionMedica;
    registro.comments = req.body.comments || registro.comments;

    // Guardar los cambios en la base de datos
    await registro.save();

    // Responder con un mensaje de éxito
    res.status(200).json({ msg: "Registro médico actualizado", status: true });
  } catch (error) {
    // Manejar errores y responder con un mensaje de error
    res.status(500).json({ msg: error.message });
  }
};


export {
    crearRegistro,
    obtenerRegistroPaciente,
    editarRegistro
}