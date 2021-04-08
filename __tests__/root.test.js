const DjpApi = require('../index');
const { testing } = require('../presets').presets.logger;

const { app } = new DjpApi({ fastifyConfig: { logger: testing } });

afterEach(() => {
  process.env.NODE_ENV = undefined;
});

test('GET /', async () => {
  const response = await app.inject({ method: 'GET', url: '/' });
  const body = JSON.parse(response.body);
  expect(response.statusCode).toBe(200);
  expect(body).toHaveProperty('code');
  expect(body).toHaveProperty('data');
});

test('GET /clientError', async () => {
  const response = await app.inject({ method: 'GET', url: '/clientError' });
  const body = JSON.parse(response.body);
  expect(response.statusCode).toBe(200);
  expect(body).toHaveProperty('message', 'A client error occured');
  expect(body).toHaveProperty('status', 'fail');
  expect(body).toHaveProperty('code');
  expect(body).toHaveProperty('data');
});

test('GET /serverError', async () => {
  const response = await app.inject({ method: 'GET', url: '/serverError' });
  const body = JSON.parse(response.body);
  expect(response.statusCode).toBe(200);
  expect(body).toHaveProperty('message', 'A server error occured');
  expect(body).toHaveProperty('status', 'error');
});

test('GET /unhandledError', async () => {
  const response = await app.inject({ method: 'GET', url: '/unhandledError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).toHaveProperty('message', 'Internal server error');
  expect(body).toHaveProperty('status', 'error');
});

test('Validation Error test (missing query parameters)', async () => {
  const response = await app.inject({ method: 'GET', url: '/validationError' });
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body)).toHaveProperty('code', 400);
  expect(JSON.parse(response.body)).toHaveProperty('status', 'fail');
  expect(JSON.parse(response.body)).toHaveProperty('message');
  expect(JSON.parse(response.body).message).toMatch(/.*querystring should have .*/g);
});

test('Debug message shown if NODE_ENV<>production /validationError', async () => {
  const response = await app.inject({ method: 'GET', url: '/validationError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).toHaveProperty('data.warning');
  expect(body).toHaveProperty('data.params');
});

test('Debug message shown if NODE_ENV<>production /clientError', async () => {
  const response = await app.inject({ method: 'GET', url: '/clientError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).toHaveProperty('data.warning');
  expect(body).toHaveProperty('data.stack');
});

test('Debug message shown if NODE_ENV<>production /serverError', async () => {
  const response = await app.inject({ method: 'GET', url: '/serverError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).toHaveProperty('data.warning');
  expect(body).toHaveProperty('data.stack');
});

test('Debug message shown if NODE_ENV<>production /unhandledError', async () => {
  const response = await app.inject({ method: 'GET', url: '/unhandledError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).toHaveProperty('data.warning');
  expect(body).toHaveProperty('data.stack');
});

test('Debug message not shown if NODE_ENV=production /validationError', async () => {
  process.env.NODE_ENV = 'production';
  const response = await app.inject({ method: 'GET', url: '/validationError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).not.toHaveProperty('data.warning');
  expect(body).not.toHaveProperty('data.params');
});

test('Debug message not shown if NODE_ENV=production /clientError', async () => {
  process.env.NODE_ENV = 'production';
  const response = await app.inject({ method: 'GET', url: '/clientError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).not.toHaveProperty('data.warning');
  expect(body).not.toHaveProperty('data.stack');
});

test('Debug message not shown if NODE_ENV=production /serverError', async () => {
  process.env.NODE_ENV = 'production';
  const response = await app.inject({ method: 'GET', url: '/serverError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).not.toHaveProperty('data.warning');
  expect(body).not.toHaveProperty('data.stack');
});

test('Debug message not shown if NODE_ENV=production /unhandledError', async () => {
  process.env.NODE_ENV = 'production';
  const response = await app.inject({ method: 'GET', url: '/unhandledError' });
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).not.toHaveProperty('data.warning');
  expect(body).not.toHaveProperty('data.stack');
});

test('404 Not Found Handler works', async () => {
  const url = '/someurlwhichdoesnotexist';
  const response = await app.inject({ method: 'GET', url });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe(`GET ${url} cannot be found`);
});

test('Swagger is ok', async () => {
  const urls = [
    '/documentation/json',
    '/documentation/static/index.html',
    '/documentation/uiConfig',
  ];

  const responses = await Promise.all(urls.map((url) => app.inject({ method: 'GET', url })));
  responses.forEach((resp) => {
    expect(resp.statusCode).toBe(200);
  });
});
