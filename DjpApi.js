const Fastify = require('fastify');
const openapiGlue = require('fastify-openapi-glue');
const Swagger = require('./Swagger');
const { defaultService } = require('./defaultService');
const { box } = require('./box');
const { errorHandler } = require('./errorHandler');

function DJPApi(config) {
  const {
    port,
    address,
    service,
    specificationFilePath,
    defaultSwaggerServer,
    swaggerOptions,
    notFoundHandler,
    fastifyConfig,
  } = config || {};

  const specification = specificationFilePath || `${__dirname}/defaultSwagger.json`;

  const DEFAULT_FASTIFY_CONFIG = {
    logger: { prettyPrint: { translateTime: 'SYS:yy-mm-dd HH:MM:ss o' } },
    pluginTimeout: 10000,
  };

  const serverConfig = {
    ...DEFAULT_FASTIFY_CONFIG, ...fastifyConfig,
  };

  const app = Fastify(serverConfig);

  this.port = port || 3000;
  this.address = address;
  this.app = app;
  this.defaultSwaggerServer = defaultSwaggerServer;
  this.specification = specification;
  this.swaggerOptions = swaggerOptions;

  Swagger.setup(this);

  const glueOptions = {
    specification,
    noAdditional: true,
    service: service || defaultService,
  };
  app.register(openapiGlue, glueOptions);

  app.decorateReply('box', box);
  app.decorateReply('xsend', box);

  app.setErrorHandler(errorHandler);

  const x = Array.isArray(notFoundHandler)
    ? notFoundHandler
    : [notFoundHandler];

  const y = [
    function handler(request, reply) {
      reply
        .status(404)
        .send(`${request.method} ${request.url} cannot be found`);
    },
  ];

  app.setNotFoundHandler(
    ...(notFoundHandler
      ? x
      : y),
  );

  return this;
}

DJPApi.prototype.start = function start(port, address) {
  this.app.listen(
    port || this.port,
    address || this.address || '0.0.0.0',

    // or (err, listening)
    (err) => {
      if (err) {
        this.app.log.error(err);
        process.exit(1);
      }
    },
  );
};

module.exports = DJPApi;
