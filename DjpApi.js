const Fastify = require("fastify");
const Swagger = require("./Swagger");
const openapiGlue = require("fastify-openapi-glue");
const { defaultService } = require("./defaultService");
const { box } = require("./box");
const { errorHandler } = require("./errorHandler");

function DJPApi(config) {
  const {
    port,
    address,
    service,
    specificationFilePath,
    defaultSwaggerServer,
    swaggerOptions,
    notFoundHandler,
  } = config || {};
  const specification =
    specificationFilePath || __dirname + "/defaultSwagger.json";

  const app = Fastify({
    logger: { prettyPrint: { translateTime: "SYS:yy-mm-dd HH:MM:ss Z o" } },
    pluginTimeout: 10000,
  });
  ssss;

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

  app.decorateReply("box", box);

  app.setErrorHandler(errorHandler);

  app.setNotFoundHandler(
    ...(notFoundHandler
      ? Array.isArray(notFoundHandler)
        ? notFoundHandler
        : [notFoundHandler]
      : [
          function (request, reply) {
            reply
              .status(404)
              .send(request.method + " " + request.url + " cannot be found");
          },
        ])
  );

  return this;
}

DJPApi.prototype.start = function (port, address) {
  this.app.listen(
    port || this.port,
    address || this.address || "0.0.0.0",
    (err, listening) => {
      if (err) {
        this.app.log.error(err);
        process.exit(1);
      }
    }
  );
};

module.exports = DJPApi;
