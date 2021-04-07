/**
 * File ini berfungsi untuk menyediakan preset-preset yang mungkin berguna bagi developer
 * yang menggunakan DJP-Api
 *
 * Apabila ada preset yang dirasa perlu, silakan membuat PR. 😉
 */

module.exports.presets = {
  logger: {
    development: { level: 'debug', prettyPrint: { translateTime: 'SYS:yy-mm-dd HH:MM:ss o' } },
    production: { level: 'warn' },
  },
};
