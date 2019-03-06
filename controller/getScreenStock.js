const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      const sqlStr = 'SELECT * FROM ERPStock';

      logger.info('erp库存情况');
      logger.info(sqlStr);

      return pool.query(sqlStr);
    })
    .then((res) => {
      const data = res.recordset[0];
      ctx.body = config.setResponseSuccess(data);
      sqlrun.close();
      next();
    })
    .catch((e) => {
      ctx.body = config.setResponseError(e.message);
      logger.error(e.message);
      try {
        sqlrun.close();
      } catch (error) {
        logger.error(error.message);
      }
      next();
    });
};

module.exports = { run };
