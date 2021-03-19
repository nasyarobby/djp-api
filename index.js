const { ClientError, ServerError } = require("./utils/errors");
const DJPApi = require("./DjpApi");

module.exports = DJPApi;
module.exports.ClientError = ClientError;
module.exports.ServerError = ServerError;
