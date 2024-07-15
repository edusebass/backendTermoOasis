import { jest } from '@jest/globals';
import { crearRegistro, obtenerRegistroPaciente, editarRegistro } from '../controllers/RegistrosController.js';
import UsuarioModelo from '../models/Usuario.js';
import CitaModelo from '../models/Citas.js';
import RegistroMedicoModelo from '../models/RegistroMedico.js';

describe('crearRegistro', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {
          idPaciente: '660f0a7a1e74f02e637b968c',
          idDoctor: '663fff4ea07407a242d48d25',
          idCita: '662972beb3941a2e156f006a',
        },
        headers: {
          'isdoctor': 'false',
        },
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    it('debería devolver acceso denegado si el usuario no es doctor', async () => {
      await crearRegistro(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
    });
  
    it('debería devolver error si el paciente no está registrado', async () => {
      req.headers.isdoctor = 'true';
  
      jest.spyOn(UsuarioModelo, 'find').mockResolvedValueOnce([]); 
  
      await crearRegistro(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
    }, 180000);
  
    it('debería devolver error si el doctor no está registrado', async () => {
      req.headers.isdoctor = 'true';
  
      jest.spyOn(UsuarioModelo, 'find').mockResolvedValueOnce([{ _id: 'paciente1', isPaciente: true }]); 
      jest.spyOn(UsuarioModelo, 'find').mockResolvedValueOnce([]); 
  
      await crearRegistro(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Especialista no registrado", status: false });
    });
  
    it('debería devolver error si la cita no está registrada', async () => {
      req.headers.isdoctor = 'true';
  
      jest.spyOn(UsuarioModelo, 'find').mockResolvedValueOnce([{ _id: 'paciente1', isPaciente: true }]); 
      jest.spyOn(UsuarioModelo, 'find').mockResolvedValueOnce([{ _id: 'doctor1', isDoctor: true }]); 
      jest.spyOn(CitaModelo, 'find').mockResolvedValueOnce([]); 
  
      await crearRegistro(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Cita no registrada", status: false });
    });
  
    it('debería devolver error si ya existe un registro médico para la cita', async () => {
      req.headers.isdoctor = 'true';
  
      jest.spyOn(UsuarioModelo, 'find').mockResolvedValueOnce([{ _id: 'paciente1', isPaciente: true }]); 
      jest.spyOn(UsuarioModelo, 'find').mockResolvedValueOnce([{ _id: 'doctor1', isDoctor: true }]); 
      jest.spyOn(CitaModelo, 'find').mockResolvedValueOnce([{ _id: 'cita1', registroMedico: 'registroExistente' }]); 
  
      await crearRegistro(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Ya existe un registro médico para esta cita", status: false });
    });
  
    it('debería crear un nuevo registro médico si todos los datos son válidos', async () => {
      req.headers.isdoctor = 'true';
      const mockCita = {
        _id: 'cita1',
        registroMedico: null, 
        save: jest.fn().mockResolvedValue(),
      };
  
      jest.spyOn(UsuarioModelo, 'find')
        .mockResolvedValueOnce([{ _id: 'paciente1', isPaciente: true }])
        .mockResolvedValueOnce([{ _id: 'doctor1', isDoctor: true }]);
      jest.spyOn(CitaModelo, 'find').mockResolvedValueOnce([mockCita]);
      jest.spyOn(RegistroMedicoModelo.prototype, 'save').mockResolvedValue();
  
      await crearRegistro(req, res);
  
      expect(res.json).toHaveBeenCalledWith({ msg: "Registro Medico creado Correctamente", status: true });
      expect(mockCita.save).toHaveBeenCalled();
    });
});



describe('obtenerRegistroPaciente', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        id: 'cita1',
      },
      headers: {
        'isdoctor': 'true',
        'issecre': 'true',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('debería obtener el registro médico del paciente si es válido', async () => {
    const registroMedicoMock = {
      idCita: 'cita1',
      data: 'información del registro médico',
    };

    jest.spyOn(RegistroMedicoModelo, 'findOne').mockResolvedValue(registroMedicoMock);

    await obtenerRegistroPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: registroMedicoMock, status: true });
  });

  it('debería devolver un mensaje de error si no se encuentra el registro médico', async () => {
    jest.spyOn(RegistroMedicoModelo, 'findOne').mockResolvedValue(null);

    await obtenerRegistroPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Registro de la cita no encontrado" });
  });

  it('debería devolver un mensaje de error si ocurre un problema con la base de datos', async () => {
    const errorMessage = 'Error al buscar el registro médico';
    jest.spyOn(RegistroMedicoModelo, 'findOne').mockRejectedValue(new Error(errorMessage));

    await obtenerRegistroPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: errorMessage, status: false });
  });

  it('debería devolver acceso denegado si no es doctor ni secretario', async () => {
    req.headers.isdoctor = 'false';
    req.headers.issecre = 'false';

    await obtenerRegistroPaciente(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
  });
});

describe('editarRegistro', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        id: 'registro1',
      },
      headers: {
        'isdoctor': 'true',
      },
      body: {
        receta: 'Nueva receta',
        dieta: 'Nueva dieta',
        actividad: 'Nueva actividad',
        cuidados: 'Nuevos cuidados',
        informacionMedica: 'Nueva información médica',
        comments: 'Nuevos comentarios',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('debería actualizar el registro médico si los datos son válidos', async () => {
    const registroMock = {
      _id: 'registro1',
      receta: 'Receta actual',
      dieta: 'Dieta actual',
      actividad: 'Actividad actual',
      cuidados: 'Cuidados actuales',
      informacionMedica: 'Información médica actual',
      comments: 'Comentarios actuales',
      save: jest.fn(),
    };

    jest.spyOn(RegistroMedicoModelo, 'findById').mockResolvedValue(registroMock);

    await editarRegistro(req, res);

    expect(registroMock.receta).toBe(req.body.receta);
    expect(registroMock.dieta).toBe(req.body.dieta);
    expect(registroMock.actividad).toBe(req.body.actividad);
    expect(registroMock.cuidados).toBe(req.body.cuidados);
    expect(registroMock.informacionMedica).toBe(req.body.informacionMedica);
    expect(registroMock.comments).toBe(req.body.comments);
    expect(registroMock.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Registro médico actualizado", status: true });
  });

  it('debería devolver un mensaje de error si no se encuentra el registro médico', async () => {
    jest.spyOn(RegistroMedicoModelo, 'findById').mockResolvedValue(null);

    await editarRegistro(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Registro no encontrado" });
  });

  it('debería devolver acceso denegado si no es doctor', async () => {
    req.headers.isdoctor = 'false';

    await editarRegistro(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
  });

});