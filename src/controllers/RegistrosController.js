import UsuarioModelo from "../models/Usuario.js";
import CitaModelo from "../models/Citas.js";
import RegistroMedicoModelo from "../models/RegistroMedico.js";

const crearRegistro = async (req, res) => {
  const { idPaciente, idDoctor, idCita} = req.body;

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

const obtenerRegistros = async (req, res) => {
  try {
    const registro = await RegistroMedicoModelo.find();

    // registro.sort((date1, date2) => date2.updatedAt - date1.updatedAt);

    res.status(200).json({ data: registro, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};
const obtenerRegistroPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await RegistroMedicoModelo.findOne({ idPaciente: id });

    // registro.sort((date1, date2) => date2.updatedAt - date1.updatedAt);

    res.status(200).json({ data: registro, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

const editarRegistro = async (req, res) => {
  const { id } = req.params;
  try {
    const registro = await RegistroMedicoModelo.findById(id);

    if (!registro) {
      const error = new Error("Registro no encontrado")
      return res.status(401).json({ msg: error.message });
    } else {
      registro.receta.nombre = req.body.receta.nombre || registro.receta.nombre,
      registro.receta.dosis = req.body.receta.dosis || registro.receta.dosis,
      registro.receta.frecuencia 
      registro.dieta.descripcion = req.body.receta.descripcion || registro.receta.descripcion,
      registro.actividad.descripcion = req.body.actividad.descripcion || registro.actividad.descripcion,
      registro.cuidados.descripcion = req.body.cuidados.descripcion || registro.cuidados.descripcion,
      registro.informacionMedica.altura = req.body.informacionMedica.altura || registro.informacionMedica.altura,
      registro.informacionMedica.peso = req.body.informacionMedica.peso || registro.informacionMedica.peso,
      registro.comments = req.body.comments || registro.comments
      registro.save()

      res.status(200).json({ msg: registro, status: true });
    }
  } catch (error) {
    res.status(404).json({ msg: error });
  }

}

export {
    crearRegistro,
    obtenerRegistros,
    obtenerRegistroPaciente,
    editarRegistro
}