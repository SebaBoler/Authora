import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AuthSphere API',
      version: '1.0.0',
      description: 'API for AuthSphere service',
    },
  },
  apis: ['./src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
