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
        'SELECT A.Y,SUM(A.ORDER_TOTAL_AMOUNT) AS AMOUNT FROM ( ' +
        'SELECT PLATFORM,YEAR(create_date) AS Y,MONTH(create_date) AS M,ORDER_TOTAL_AMOUNT FROM  T_TRADE_ORDER ' +
        ') A ' +
        'GROUP BY A.Y ' +
        'ORDER BY A.Y ';

      logger.info('年交易额占比');
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
