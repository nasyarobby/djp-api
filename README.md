# DJP-API

installing github module as npm module
```
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
```
const DJPApi = require("djp-api");

const app = new DJPApi();
app.start();
```
