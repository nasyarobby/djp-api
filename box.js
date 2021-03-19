module.exports.box = function (
  message,
  data,
  code = "200",
  status = "success",
  statusCode = 200
) {
  const response = {
    message,
    status,
    code,
    data,
  };

  return this.status(statusCode).send(response);
};
