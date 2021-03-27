const { ClientError, ServerError } = require("./utils/errors");

module.exports.errorHandler = (error, request, reply) => {
  if (error.validation && error.validation.length > 0) {
    const message = error.message;
    return reply.box(
      message,
      process.env.NODE_ENV !== "production" && error.validation.length
        ? {
            warning:
              "DATA ONLY APPEARS ON DEV ENVIRONMENT AND WILL NOT BE AVAILABLE IN PRODUCTION ENVIRONMENT. USE ONLY FOR DEBUGGING PURPOSE ONLY.",
            ...error.validation[0],
          }
        : undefined,
      {
        code: 400,
        status: "fail",
      }
    );
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
    "Internal server error",
    process.env.NODE_ENV !== "production"
      ? { ...error.data, stack: error.stack, error: error.error }
      : error.data,
    500,
    "error"
  );
};
