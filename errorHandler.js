const { ClientError, ServerError } = require("./utils/errors");

const DEV_ONLY_MESSAGE = "DATA ONLY APPEARS ON DEV ENVIRONMENT AND WILL NOT BE AVAILABLE IN PRODUCTION ENVIRONMENT. USE ONLY FOR DEBUGGING PURPOSE ONLY."

module.exports.errorHandler = (error, request, reply) => {
  if (error.validation && error.validation.length > 0) {
    const message = error.message;
    return reply.box(
      message,
      process.env.NODE_ENV !== "production" && error.validation.length
        ? {
          warning: DEV_ONLY_MESSAGE,
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
        ? {
          warning: DEV_ONLY_MESSAGE, ...error.data, stack: error.stack, error: error.error
        }
        : error.data,
      { code: error.code, status: error.status }
    );
  }

  // Unhandled error, log sebagai error.
  request.log.error(error)

  return reply.box(
    "Internal server error",
    process.env.NODE_ENV !== "production"
      ? { warning: DEV_ONLY_MESSAGE, ...error, stack: error.stack, error: error.error }
      : error.data,
    { code: 500, status: "error" }
  );
};
