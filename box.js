function send(message, data, config = {}) {
  const response = {
    message: message,
    status: config.status || "success",
    code: config.code || config.statusCode || 200,
    data: data || undefined,
  };

  return this.status(config.statusCode || 200).send(response);
}
module.exports.box = send;
