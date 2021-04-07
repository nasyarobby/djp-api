class ApiError extends Error {
  constructor(message, config) {
    super(message);
    this.name = this.constructor.name;
    this.data = (config && config.data) || null;
    this.error = (config
      && config.error && {
      name: config.error.name,
      message: config.error.message,
      stack: config.error.stack,
    })
    || undefined;
  }
}

module.exports = ApiError;
