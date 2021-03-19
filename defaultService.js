const { ClientError, ServerError } = require("./utils/errors");

module.exports.defaultService = {
  index: function (req, res) {
    res.box({ name: "Server is up" }, "Status OK");
  },
  clientError: function (req, res) {
    try {
      throw new Error("Handled error resolved as ClientError.");
    } catch (error) {
      throw new ClientError("A client error occured", { error });
    }
  },
  serverError: function (req, res) {
    try {
      throw new Error("Handled error resolved as ServerError.");
    } catch (error) {
      throw new ServerError("A server error occured", { error });
    }
  },
  unhandledError: function (req, res) {
    throw new Error("Unhandled error occured");
  },
};
