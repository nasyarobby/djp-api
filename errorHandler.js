const { ClientError, ServerError } = require("./utils/errors");

module.exports.errorHandler = (error, request, reply) => {
  if (error.validation && error.validation.length > 0) {
    const path = error.validation[0].dataPath;
    const field = path.charAt(1).toUpperCase() + path.slice(2);
    const message = `${field} ${error.validation[0].message}`;
    reply.box(message);
  }

  if (error instanceof ClientError || error instanceof ServerError) {
    return reply.box(
      error.message,
      process.env.NODE_ENV !== "production"
        ? { ...error.data, stack: error.stack, error: error.error }
        : error.data,
      error.code,
      error.status
    );
  }

  return reply.box(
    process.env.NODE_ENV !== "production"
      ? { ...error.data, stack: error.stack, error: error.error }
      : error.data,
    "Internal server error",
    500,
    "error"
  );
};
