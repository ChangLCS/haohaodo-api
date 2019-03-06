const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  let name = ctx.query.name || 0;
  const top = ctx.query.top || 100;

  if (name === '黑龙江') {
    name = '哈尔滨';
  }

  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      const sqlStr =
        'SELECT A.* FROM (' +
        `SELECT TOP ${top} HOSPITAL_CODE,HOSPITAL_NAME, CREATE_DATE,ORDER_TOTAL_AMOUNT = SUM(ORDER_TOTAL_AMOUNT),PLATFORM FROM T_TRADE_ORDER WHERE ${
          Number(name) === 0 ? '1=1' : `PLATFORM = '${name}'`
        } GROUP BY HOSPITAL_CODE,HOSPITAL_NAME, CREATE_DATE, PLATFORM ORDER BY CREATE_DATE DESC) ` +
        'AS A ORDER BY A.CREATE_DATE DESC';

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
