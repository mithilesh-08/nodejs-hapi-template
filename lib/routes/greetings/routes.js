export default [
  {
    method: 'GET',
    path: '/',
    options: {
      description: 'Get a greeting message',
      notes: 'Returns a simple greeting',
      tags: ['api', 'greetings'],
      cors: true,
      auth: false
    },
    handler: async (request, h) => 
       h.response({
        message: 'Hello from Hapi.js!',
        timestamp: new Date().toISOString()
      })
    
  },
  {
    method: 'GET',
    path: '/{name}',
    options: {
      description: 'Get a personalized greeting',
      notes: 'Returns a greeting with the provided name',
      tags: ['api', 'greetings'],
      cors: true,
      auth: false
    },
    handler: async (request, h) => {
      const { name } = request.params;
      return h.response({
        message: `Hello ${name}! Welcome to Hapi.js!`,
        timestamp: new Date().toISOString()
      });
    },
  }
]; 