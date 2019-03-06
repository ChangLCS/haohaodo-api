const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      const sqlStr = 'SELECT * FROM TTRADETIMEAXIS ';

      logger.info('上线情况时间轴');
      logger.info(sqlStr);

      return pool.query(sqlStr);
    })
    .then((res) => {
      ctx.body = config.setResponseSuccess(res.recordset);
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
