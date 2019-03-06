const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const top = ctx.query.top || 0;

  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      // const sqlStr =
      //   "SELECT * FROM RPT1 WHERE Y = YEAR(GETDATE()) AND PLATFORM <> '全部' ORDER BY PLATFORM ";
      const sqlStr =
        "SELECT * FROM RPT1 WHERE Y = YEAR(GETDATE())-1 AND PLATFORM <> '全部' ORDER BY PLATFORM ";

      logger.info('年销量趋势图');
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
