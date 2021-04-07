const fastify = jest.fn().mockImplementation(() => ({
  register: jest.fn(),
  addHook: jest.fn(),
  decorateReply: jest.fn(),
  setErrorHandler: jest.fn(),
  setNotFoundHandler: jest.fn(),
}));

module.exports = fastify;
