import Usuario from '../models/Usuario.js'; 
import { jest } from '@jest/globals';
import{
    recuperarPassword,
    nuevaPassword,
    comprobarTokenPassword,
} from "../controllers/UsuarioController.js";

describe('recuperarPassword', () => {
    

  it('debe devolver un error si el usuario no está registrado y enviar el correo', async () => {
    const mockReq = {
      body: {
        email: 'usuario_no_registrado@example.com',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    Usuario.findOne = jest.fn().mockResolvedValue(null);
  
    await recuperarPassword(mockReq, mockRes);
  
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, el usuario no se encuentra registrado",
    });
  });
  
});

describe('comprobarTokenPassword', () => {
  it('debe confirmar el token y devolver un mensaje de éxito', async () => {
    const mockReq = {
      params: {
        token: 'mocked_token',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Usuario.findOne = jest.fn().mockResolvedValue({
      token: 'mocked_token',
      save: jest.fn().mockResolvedValue(),
    });

    await comprobarTokenPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      msg: "Token confirmado, ya puedes crear tu nuevo password",
    });
  });

  it('debe devolver un error si el token no se puede validar', async () => {
    const mockReq = {
      params: {
        token: 'token_invalido',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Usuario.findOne = jest.fn().mockResolvedValue(null);

    await comprobarTokenPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, no se puede validar la cuenta",
    });
  });
});

describe('nuevaPassword', () => {
  it('debe actualizar la contraseña y devolver un mensaje de éxito', async () => {
    const mockReq = {
      params: {
        token: 'mocked_token',
      },
      body: {
        password: 'nueva_contraseña',
        confirmPassword: 'nueva_contraseña',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Usuario.findOne = jest.fn().mockResolvedValue({
      token: 'mocked_token',
      encrypPassword: jest.fn().mockResolvedValue('hashed_password'),
      save: jest.fn().mockResolvedValue(),
    });

    await nuevaPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password",
    });
  });

  it('debe devolver un error si las contraseñas no coinciden', async () => {
    const mockReq = {
      params: {
        token: 'mocked_token',
      },
      body: {
        password: 'contraseña1',
        confirmPassword: 'contraseña2',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await nuevaPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, los contraseñas no coinciden",
    });
  });

  it('debe devolver un error si no se pueden llenar todos los campos', async () => {
    const mockReq = {
      params: {
        token: 'mocked_token',
      },
      body: {
        password: '',
        confirmPassword: '',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await nuevaPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, debes llenar todos los campos",
    });
  });

  it('debe devolver un error si no se puede validar la cuenta', async () => {
    const mockReq = {
      params: {}, 
      body: {
        password: 'nueva_contraseña',
        confirmPassword: 'nueva_contraseña',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await nuevaPassword(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      msg: "Lo sentimos, no se puede validar la cuenta",
    });
  });
});
