import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url'; 

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// console.log("adfasdf" + __dirname)

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentacion TERMO OASIS',
            version: '1.0.0',
            description: 'Documentacion para los endpoints',
        },
        servers: [{ url: 'http://localhost:3001', description: 'Development server' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    // apis: [`${path.join(__dirname, "../routes/*.js")}`],
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
