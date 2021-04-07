const FastifySwagger = require('fastify-swagger');

module.exports.setup = function setup(instance) {
  const swaggerServers = [{ url: instance.defaultSwaggerServer || `http://localhost:${instance.port}` }];
  if (process.env.SWAGGER_HOSTS) {
    process.env.SWAGGER_HOSTS.split(',').forEach((host) => swaggerServers.push({ url: host }));
  }

  // SETTING UP SWAGGER
  instance.app.register(FastifySwagger, this.swaggerOptions || {
    mode: 'static',
    specification: {
      path: instance.specification,
      postProcessor: (swaggerObject) => {
        const swagger = {
          ...swaggerObject,
          servers: swaggerServers,
        };
        return swagger;
      },
    },
    exposeRoute: true,
  });

  instance.app.addHook('preSerialization', (request, reply, payload, done) => {
    if (request.headers['x-forwarded-proto'] && request.headers['x-forwarded-host']) {
      const url = `${request.headers['x-forwarded-proto']}://${request.headers['x-forwarded-host']}${process.env.ENDPOINT_PREFIX || '/api'
      }`;
      if (!swaggerServers.find((server) => server.url === url)) swaggerServers.push({ url });
    }
    done(null, payload);
  });
};
