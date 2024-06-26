import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentacion TERMO OASIS',
            version: '1.0.0',
            description: 'Documentacion para los endpoints',
        },
        servers: [{ url: 'https://backend-termo-oasis.vercel.app', description: 'Production server' }],
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

    apis: ["./src/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
