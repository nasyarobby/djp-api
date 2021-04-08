const DJPApi = require('../index');

describe('Test main functions', () => {
  test('default props', () => {
    const Server = new DJPApi();
    expect(Server.port).toBe(3000);
  });

  test('if set, set port properly', () => {
    const Server = new DJPApi({ port: 3001 });
    expect(Server.port).toBe(3001);
  });

  test('if set, specificationFilePath set properly', () => {
    const Server = new DJPApi({ specificationFilePath: 'test' });
    expect(Server.specification).toBe('test');
  });
});
