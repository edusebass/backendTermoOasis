import UsuarioModelo from "../models/Usuario.js";
import CitaModelo from "../models/Citas.js";
import RegistroMedicoModelo from "../models/RegistroMedico.js";

const crearRegistro = async (req, res) => {
  const { idPaciente, idDoctor, idCita} = req.body;

  const isDoctor = req.headers['isdoctor'] === 'true';

  if (!isDoctor ) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }

  try {
    const existPaciente = await UsuarioModelo.find({
      _id: idPaciente,
      isPaciente: true,
    });
    const existDoctor = await UsuarioModelo.find({
      _id: idDoctor,
      isDoctor: true ,
    });

    if (!existPaciente[0]) {
      const error = new Error("Paciente no registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    if (!existDoctor[0]) {
      const error = new Error("Especialista no registrado");
      return res.status(400).json({ msg: error.message, status: false });
    }

    const existCita = await CitaModelo.find({
      _id: idCita,
    });

    if (!existCita[0]) {
      const error = new Error("Cita no registrada");
      return res.status(400).json({ msg: error.message, status: false });
    }
    console.log(existCita[0])

    // Verificar si la cita ya tiene un registro médico asociado
    if (existCita[0].registroMedico) {
      const error = new Error("Ya existe un registro médico para esta cita");
      return res.status(400).json({ msg: error.message, status: false });
    }

    const registro = new RegistroMedicoModelo(req.body);

    await registro.save();

    existCita[0].registroMedico = registro._id;
    await existCita[0].save();

    res
      .status(200)
      .json({ msg: "Registro Medico creado Correctamente", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: error.message, status: false });
  }
};

const obtenerRegistroPaciente = async (req, res) => {
  const { id } = req.params;
  const isDoctor = req.headers['isdoctor'] === 'true';
  const isSecre = req.headers['issecre'] === 'true';


  if (!isDoctor && !isSecre) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }
  
  try {
    const registroMedico = await RegistroMedicoModelo.findOne({ idCita: id });


    res.status(200).json({ data: registroMedico, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const editarRegistro = async (req, res) => {
  const { id } = req.params;

  const isDoctor = req.headers['isdoctor'] === 'true';

  if (!isDoctor ) {
    return res.status(403).json({ msg: "Acceso denegado", status: false });
  }

  try {
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