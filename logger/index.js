const log4js = require('log4js');
const dateFormatter = require('../utils/dateFormatter');

log4js.configure({
  appenders: {
    log: {
      type: 'dateFile',
      filename: 'logs/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    console: {
      type: 'console',
    },
  },
  categories: {
    default: {
      appenders: ['log', 'console'],
      level: 'trace',
    },
  },
});

const logger = log4js.getLogger();

module.exports = logger;
