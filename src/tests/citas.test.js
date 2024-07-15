import { crearCita, editarCita, mostrarCitas, mostrarCitaID } from '../controllers/CitaController.js'
import { jest } from '@jest/globals'
import CitaModelo from '../models/Citas.js'
import request  from 'supertest'

describe('crearCita', () => {
  const mockReq = {
    body: {
      idPaciente: '668d9406fa1b284b74bab58d',
      idDoctor: '668d9f6233596c4e615193c5',
      start: new Date().toISOString(), 
      end: new Date().toISOString(), 
      comentarios: 'Comentarios de prueba',
    },
    headers: {
      'issecre': 'true',
    },
  };
  
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no debería crear una cita si falla la validación de datos', async () => {
    const reqWithMissingField = {
      ...mockReq,
      body: {
        ...mockReq.body,
        idPaciente: ''
      },
    };

    await crearCita(reqWithMissingField, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "Lo sentimos, debes llenar todos los campos" });
  });

  it('debería devolver 403 si se niega el acceso', async () => {
    const reqWithoutAccess = {
      ...mockReq,
      headers: {
        'issecre': 'false',
      },
    };

    await crearCita(reqWithoutAccess, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
  });

  it('no debería crear una cita si el paciente o el doctor no están registrados', async () => {
    const reqWithInvalidIds = {
      ...mockReq,
      body: {
        ...mockReq.body,
        idPaciente: 'idInvalido',
        idDoctor: 'idInvalido',
      },
    };

    await crearCita(reqWithInvalidIds, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('debería agendar una cita correctamente si los datos son válidos', async () => {
    CitaModelo.prototype.save = jest.fn().mockResolvedValue({
      _id: 'idCita',
      idPaciente: 'idPacienteValido',
      idDoctor: 'idDoctorValido',
      start: mockReq.body.start,
      end: mockReq.body.end,
      comentarios: mockReq.body.comentarios,
    });
    

    const reqWithValidData = {
      ...mockReq,
      body: {
        ...mockReq.body,
        idPaciente: 'idPacienteValido',
        idDoctor: 'idDoctorValido',
      },
    };

    await crearCita(reqWithValidData, mockRes);

  });
});

describe('editarCita', () => {
  const mockReq = {
    params: {
      id: 'idCitaExistente', 
    },
    body: {
      start: new Date().toISOString(), 
      end: new Date().toISOString(), 
      comentarios: 'Nuevos comentarios de prueba', 
    },
    headers: {
      'issecre': 'true',
    },
  };
  
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería actualizar una cita existente correctamente', async () => {
    const citaExistente = new CitaModelo({
      _id: 'idCitaExistente',
      idPaciente: 'idPacienteValido',
      idDoctor: 'idDoctorValido',
      start: new Date(), 
      end: new Date(),
      comentarios: 'Comentarios de prueba', 
    });
  
    CitaModelo.findById = jest.fn().mockResolvedValue(citaExistente);
  
    citaExistente.save = jest.fn().mockResolvedValue({
      _id: 'idCitaExistente',
      idPaciente: citaExistente.idPaciente,
      idDoctor: citaExistente.idDoctor,
      start: mockReq.body.start,
      end: mockReq.body.end,
      comentarios: mockReq.body.comentarios,
    });
  
    await expect(editarCita(mockReq, mockRes)).resolves.toBeUndefined();
  }, 100000); 
  

  it('debería devolver 404 si la cita esta mal', async () => {
    CitaModelo.findById = jest.fn().mockResolvedValue(null);

    await editarCita(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "No puedes reagendar citas en el pasado", status: false });
  });
});

describe('cancelar cita', () => {
  const app = "https://backend-termo-oasis.vercel.app"; 
  test('no debería cancelar la cita si algun dato esta incorrecto de condicion', async () => {
    // Datos de inicio de sesión
    const loginData = {
      email: "oswaldo.aviles_TO@outlook.com",
      password: "is7T&O_doc"
    };

    const loginRes = await request(app)
      .post('/api/login')
      .send(loginData);
      
    const token = loginRes._body.token;
    
    // ID de la cita a cancelar
    const cita = "668de06e96aa48fb7b12005f";
   
    const cancelRes = await request(app)
      .put(`/api/citas/cancelar/${cita}`)
      .set('authorization', `Bearer ${token}`)
      .set('issecre', 'true');

    expect(cancelRes.statusCode).toBe(400);
  
  }, 18000); 
});

describe('listar citas de un paciente', () => {
  const app = "https://backend-termo-oasis.vercel.app"; 

  test('debería devolver las citas del paciente si se tiene acceso como secre', async () => {
    const idPacienteValido = "66876222cb117117886952ac";
    const loginData = {
      email: "oswaldo.aviles_TO@outlook.com",
      password: "is7T&O_doc"
    };
    const loginRes = await request(app)
      .post('/api/login')
      .send(loginData);
      
    const token = loginRes._body.token;
    const res = await request(app)
      .get(`/api/citas/paciente/${idPacienteValido}`)
      .set('authorization', `Bearer ${token}` )
      .set('issecre', 'true');

    console.log(res.body); 
    expect(res.statusCode).toBe(200);
  
  }, 18000);
});






describe('mostrar todas las citas', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      headers: {
        'issecre': 'false',
        'isdoctor': 'false',
        'ispaciente': 'false'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('debería devolver acceso denegado si ningún rol es verdadero', async () => {
    await mostrarCitas(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
  });

  it('debería devolver las citas si el rol de doctor es verdadero', async () => {
    req.headers.isdoctor = 'true';
  
    const citasMock = [
      { updatedAt: new Date('2023-07-09'), otherField: 'cita1' },
      { updatedAt: new Date('2023-07-10'), otherField: 'cita2' }
    ];
  
    const spy = jest.spyOn(CitaModelo, 'find').mockReturnValue({
      populate: jest.fn().mockResolvedValue(citasMock)
    });
  
    await mostrarCitas(req, res);
  
    expect(res.json).toHaveBeenCalledWith({
      data: citasMock.sort((date1, date2) => date2.updatedAt - date1.updatedAt),
      status: true
    });
  
    spy.mockRestore();
  }, 300000);
 
});


describe('mostrarCitaID', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { id: '668752b8dd2c2bdd518451d2' },
      headers: {
        'issecre': 'false',
        'isdoctor': 'false',
        'ispaciente': 'false'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('debería devolver acceso denegado si ningún rol es verdadero', async () => {
    await mostrarCitaID(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
  });

  it('debería devolver la cita si algún rol es verdadero', async () => {
    req.headers.isdoctor = 'true';
    const citaMock = { _id: '123', idPaciente: 'paciente1', idDoctor: { nombre: 'Doctor', apellido: 'Apellido' } };

    const spy = jest.spyOn(CitaModelo, 'findById').mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(citaMock)
      }))
    }));

    await mostrarCitaID(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: citaMock, status: true });

    spy.mockRestore();
  });

  it('debería devolver un error si la cita no existe', async () => {
    req.headers.isdoctor = 'true';

    const spy = jest.spyOn(CitaModelo, 'findById').mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null)
      }))
    }));

    await mostrarCitaID(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Cita no existe' });

    spy.mockRestore();
  });
});
