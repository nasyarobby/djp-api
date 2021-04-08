const DjpApi = require('../index');
const { testing } = require('../presets').presets.logger;

const { app } = new DjpApi({ fastifyConfig: { logger: testing } });

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

test.todo('Validation Error test');
test.todo('Debug message shown if NODE_ENV=production');

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
