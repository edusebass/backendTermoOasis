import { recuperarPasswordMovil } from '../controllers/UsuarioController.js';
import Usuario from '../models/Usuario.js';
import { jest } from '@jest/globals';

const req = {
    body: {
        nombre: 'NombreUsuario',
        apellido: 'ApellidoUsuario',
        email: 'usuario@example.com'
    }
};

const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
};

describe('recuperarPasswordMovil', () => {
    it('debería enviar una nueva contraseña por correo y actualizarla en la base de datos', async () => {
        Usuario.findOne = jest.fn().mockResolvedValue({
            nombre: 'NombreUsuario',
            apellido: 'ApellidoUsuario',
            email: 'usuario@example.com',
            password: 'passwordActual',
            encrypPassword: jest.fn().mockResolvedValue('passwordEncriptada'),
            save: jest.fn().mockResolvedValue(),
        });

        await recuperarPasswordMovil(req, res);

        expect(Usuario.findOne).toHaveBeenCalledWith({
            nombre: 'NombreUsuario',
            apellido: 'ApellidoUsuario',
            email: 'usuario@example.com',
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: "Se envió tu nueva password al correo registrado del usuario" });
    });

    it('debería manejar el caso donde faltan campos en la solicitud', async () => {
        const reqFaltante = { body: { nombre: '', apellido: 'ApellidoUsuario', email: 'usuario@example.com' } };

        await recuperarPasswordMovil(reqFaltante, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Lo sentimos, debes llenar todos los campos" });
    });

    it('debería manejar el caso donde el usuario no está registrado', async () => {
        Usuario.findOne = jest.fn().mockResolvedValue(null);

        await recuperarPasswordMovil(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    });
});
