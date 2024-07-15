import { obtenerPacientes, eliminarUsuario, detallePaciente, perfil } from "../controllers/UsuarioController.js"; 
import UsuarioModelo from '../models/Usuario.js'; 
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

describe('obtenerPacientes', () => {
    it('debe devolver acceso denegado si no es secretario ni doctor', async () => {
        const mockReq = {
            headers: {
                'issecre': 'false',
                'isdoctor': 'false'
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await obtenerPacientes(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
    });


    it('debe devolver los pacientes si la consulta es exitosa', async () => {
        const mockReq = {
            headers: {
                'issecre': 'true',
                'isdoctor': 'false'
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockPacientes = [
            { nombre: 'Paciente1', isPaciente: true },
            { nombre: 'Paciente2', isPaciente: true }
        ];
        UsuarioModelo.find = jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockPacientes)
        });

        await obtenerPacientes(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({ data: mockPacientes, status: true });
    });
});

describe('eliminarUsuario', () => {
    it('debe devolver acceso denegado si no es secretario', async () => {
        const mockReq = {
            headers: {
                'issecre': 'false'
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await eliminarUsuario(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
    });

    it('debe devolver un error si el ID no es válido', async () => {
        const mockReq = {
            headers: {
                'issecre': 'true'
            },
            params: {
                id: 'invalid-id'
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await eliminarUsuario(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ msg: "Lo sentimos, no existe el usuario con ID invalid-id" });
    });

    it('debe eliminar el usuario y devolver un mensaje de éxito', async () => {
        const validId = new mongoose.Types.ObjectId().toString();
        const mockReq = {
            headers: {
                'issecre': 'true'
            },
            params: {
                id: validId
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        UsuarioModelo.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: validId });

        await eliminarUsuario(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Usuario eliminado exitosamente', usuarioEliminado: { _id: validId } });
    });
});


describe('detallePaciente', () => {
    it('debe devolver acceso denegado si el usuario no es secretario, doctor o paciente', async () => {
        const mockReq = {
            headers: {
                'issecre': 'false',
                'isdoctor': 'false',
                'ispaciente': 'false'
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await detallePaciente(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ msg: "Acceso denegado", status: false });
    });

    it('debe devolver un error si el ID no es válido', async () => {
        const mockReq = {
            headers: {
                'issecre': 'true',
                'isdoctor': 'false',
                'ispaciente': 'false'
            },
            params: {
                id: 'invalid-id'
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await detallePaciente(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ msg: "Lo sentimos no existe el paciente invalid-id" });
    });

    it('debe devolver los detalles del paciente si se encuentra y los permisos son válidos', async () => {
        const validId = new mongoose.Types.ObjectId().toString();
        const mockReq = {
            headers: {
                'issecre': 'true',
                'isdoctor': 'true',
                'ispaciente': 'true'
            },
            params: {
                id: validId
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockSelect = jest.fn().mockResolvedValue({
            _id: validId,
            nombre: 'Paciente',
            apellido: 'Ejemplo',
            email: 'paciente@example.com'
        });

        UsuarioModelo.findById = jest.fn().mockReturnValue({
            select: mockSelect
        });

        await detallePaciente(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            paciente: {
                _id: validId,
                nombre: 'Paciente',
                apellido: 'Ejemplo',
                email: 'paciente@example.com'
            }
        });

        expect(UsuarioModelo.findById).toHaveBeenCalledWith(validId);
        expect(mockSelect).toHaveBeenCalledWith("-createdAt -updatedAt -__v");
    });

});



describe('perfil', () => {
    it('debe eliminar los campos token, createdAt, updatedAt y __v del usuario y devolver el perfil logueado', () => {
        const mockReq = {
            usuarioBDD: {
                nombre: 'Usuario',
                apellido: 'Ejemplo',
                email: 'usuario@example.com',
                token: 'someToken',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-02',
                __v: 0
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        perfil(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            nombre: 'Usuario',
            apellido: 'Ejemplo',
            email: 'usuario@example.com',
        });

        expect(mockReq.usuarioBDD.token).toBeUndefined();
        expect(mockReq.usuarioBDD.createdAt).toBeUndefined();
        expect(mockReq.usuarioBDD.updatedAt).toBeUndefined();
        expect(mockReq.usuarioBDD.__v).toBeUndefined();
    });
});
