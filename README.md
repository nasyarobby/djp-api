# DJP-API

![alt text](https://github.com/nasyarobby/djp-api/actions/workflows/node.js.yml/badge.svg "Build status")

Wrapper API Server menggunakan Fastify.

installing github module as npm module
```bash
git clone https://github.com/nasyarobby/djp-api/ djp-api
mkdir new-api-project
cd new-api-project
npm init -y
npm install ../djp-api
code index.js
```

atau
```
npm install https://github.com/nasyarobby/djp-api/
```

cara menggunakan module (index.js)
```javascript 
const DJPApi = require("djp-api");

const app = new DJPApi();
app.start();
```

```javascript 
const config = {
  port: 3000,
  address: '0.0.0.0',
  service: {
      index(req, res) { 
        res.box('Message', { namaService: 'DJP-API' });
      }
  },
  specificationFilePath: `${__dirname}/swagger.json`,
};

const app = new DJPApi(config);
```
