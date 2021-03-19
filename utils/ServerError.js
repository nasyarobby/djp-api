const ApiError = require('./ApiError');

class ServerError extends ApiError {
  constructor(message, config) {
    super(message, config);
    this.status = (config && config.status) || 'error';
    this.code = (config && config.code) || 500;
  }
}

module.exports = ServerError;
