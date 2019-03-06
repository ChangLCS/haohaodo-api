const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

//  品种累计销售
const run = async (ctx, next) => {
  const sqlrun = sql();
  const name = ctx.query.name || 0;

  await sqlrun
    .connect()
    .then((pool) => {
      const sqlStr =
        'SELECT PRODUCT_NAME AS NAME, SUM(PRODUCT_TOTAL_AMOUNT - close_num*UNIT_PRICE) AS AMT FROM T_TRADE_ORDER_ITEMS ' +
        `WHERE ${name ? `PLATFORM = '${name}'` : '1=1'} ` +
        'GROUP BY PRODUCT_NAME,DRUGSCODE ORDER BY AMT DESC ';

      logger.info('品种累计销售');
      logger.info(sqlStr);

      return pool.query(sqlStr);
    })
    .then((res) => {
      const data = res.recordset;
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
