// swaggerConfig.js

import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url'; // Para convertir import.meta.url a una ruta de archivo

// Obtener el directorio actual (__dirname) en módulos ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation for your API endpoints',
        },
        servers: [{ url: 'http://localhost:3001', description: 'Development server' }],
    },

    // Especifica cómo encontrar los endpoints en tus rutas
    apis: [`${path.join(__dirname, "../routes/*.js")}`],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
