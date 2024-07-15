import { registro } from '../controllers/UsuarioController.js';
import { jest } from '@jest/globals'; 
import Usuario from '../models/Usuario.js';

describe('registro', () => {
  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  it('debe registrar un usuario correctamente si todos los campos son válidos', async () => {
    const mockReq = {
      body: {
        email: 'correo@example.com',
        password: '123Qwe*qwe',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Usuario, 'findOne').mockResolvedValue(null); 

    const mockEncrypPassword = jest.fn().mockResolvedValue('hashedPassword');
    const mockNuevoUsuarioSave = jest.fn().mockResolvedValue(); 

    jest.spyOn(Usuario.prototype, 'encrypPassword').mockImplementation(mockEncrypPassword);
    jest.spyOn(Usuario.prototype, 'save').mockImplementation(mockNuevoUsuarioSave);

    await registro(mockReq, mockRes);

    expect(mockEncrypPassword).toHaveBeenCalledWith('123Qwe*qwe');
    expect(mockNuevoUsuarioSave).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "Usuario registrado" });
  });

  it('debe devolver un error 400 si el email ya está registrado', async () => {
    const mockReq = {
      body: {
        email: 'correo@example.com',
        password: 'qwe123Ert.*',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Usuario, 'findOne').mockResolvedValue({ email: 'correo@example.com' }); 

    await registro(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: "Lo sentimos, el email ya se encuentra registrado" });
  });


});
