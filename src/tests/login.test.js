import { login } from '../controllers/UsuarioController.js';
import Usuario from '../models/Usuario.js';
import { jest } from '@jest/globals';

describe('login', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe iniciar sesión correctamente si las credenciales son válidas', async () => {
    const mockReq = {
      body: {
        email: 'correo@example.com',
        password: 'contraseña',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Usuario.findOne = jest.fn().mockImplementation(() => ({
      _id: 'id_usuario_mock',
      email: 'correo@example.com',
      matchPassword: jest.fn().mockResolvedValue(true),
      nombre: 'Nombre',
      apellido: 'Apellido',
      isDoctor: false,
      isPaciente: true,
      isSecre: false,
      fechaNacimiento: '1990-01-01',
      lugarNacimiento: 'Lugar',
      estadoCivil: 'Soltero',
      direccion: 'Dirección',
      telefono: '123456789',
      cedula: '1234567890',
    }));

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
      nombre: 'Nombre',
      apellido: 'Apellido',
      _id: 'id_usuario_mock',
      isDoctor: false,
      isPaciente: true,
      isSecre: false,
      fechaNacimiento: '1990-01-01',
      lugarNacimiento: 'Lugar',
      estadoCivil: 'Soltero',
      direccion: 'Dirección',
      telefono: '123456789',
      cedula: '1234567890',
      email: 'correo@example.com',
    }));
  });

  it('debe devolver un error 404 si algún campo está vacío', async () => {
    const mockReq = {
      body: {
        email: '',
        password: 'contraseña',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "Lo sentimos, debes llenar todos los campos" });
  });

  it('debe devolver un error 404 si el usuario no está registrado', async () => {
    const mockReq = {
      body: {
        email: 'correo_no_registrado@example.com',
        password: 'contraseña',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Usuario.findOne = jest.fn().mockResolvedValue(null);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  });

  it('debe devolver un error 404 si la contraseña es incorrecta', async () => {
    const mockReq = {
      body: {
        email: 'correo@example.com',
        password: 'contraseña_incorrecta',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Usuario.findOne = jest.fn().mockImplementation(() => ({
      email: 'correo@example.com',
      matchPassword: jest.fn().mockResolvedValue(false),
    }));

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "Lo sentimos, la password no es la correcta" });
  });
});
