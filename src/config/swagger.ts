import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Inventarios',
            version: '1.0.0',
            description: 'API REST para la gestión de inventarios'
        },
        servers: [
            {
                url: 'http://localhost:3000',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
        apis: ['src/modules/**/*.ts']
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);