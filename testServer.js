const DjpApi = require('./index');

const app = new DjpApi({ fastifyConfig: { logger: DjpApi.PRESETS.logger.production } });
app.start();
