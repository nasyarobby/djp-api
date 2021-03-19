const ApiError = require('./ApiError');

class ClientError extends ApiError {
  constructor(message, config) {
    super(message, config);
    this.status = (config && config.status) || 'fail';
    this.code = (config && config.code) || 400;
  }
}

module.exports = ClientError;
