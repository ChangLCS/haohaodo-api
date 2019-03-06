const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

//  配送商累计成交
const run = async (ctx, next) => {
  const sqlrun = sql();
  const name = ctx.query.name || 0;

  await sqlrun
    .connect()
    .then((pool) => {
      const sqlStr =
        'SELECT PEI_SONG_QI_YE_NAME AS NAME, SUM(ORDER_TOTAL_AMOUNT) AS AMT FROM T_TRADE_ORDER ' +
        `WHERE ${name ? `PLATFORM = '${name}'` : '1=1'} ` +
        'GROUP BY PEI_SONG_QI_YE_CODE,PEI_SONG_QI_YE_NAME ORDER BY AMT DESC ';

      logger.info('配送商累计成交');
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
