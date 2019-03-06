const sql = require('../sql');
const date = require('../utils/dateFormatter');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const name = ctx.query.name || 0;

  const data = {
    arr: [],
    list: [],
  };

  const sqlOrder = sql();

  await sqlOrder
    .connect()
    .then((pool) => {
      const sqlStr =
        'SELECT * FROM ' +
        '(SELECT *,ROW_NUMBER() OVER (PARTITION BY HOSPITAL_NAME ORDER BY CREATE_DATE DESC) AS ROWNAME FROM T_TRADE_ORDER) AS A ' +
        `WHERE A.ROWNAME <= 5 AND A.PLATFORM = '${name}' ORDER BY A.CREATE_DATE DESC`;

      logger.debug(sqlStr);
      return pool.query(sqlStr);
    })
    .then((res) => {
      data.list = res.recordset;
      sqlOrder.close();
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

  const sqlAmount = sql();
  await sqlAmount
    .connect()
    .then((pool) => {
      const sqlStr =
        'SELECT HOSPITAL_CODE, HOSPITAL_NAME,SUM(ORDER_TOTAL_AMOUNT) AS AMOUNT,PLATFORM,YEAR(GETDATE()) AS YEAR FROM T_TRADE_ORDER ' +
        `WHERE PLATFORM = '${name}' ` +
        'AND CREATE_DATE < GETDATE() AND CREATE_DATE > DATEADD(YEAR,-1,GETDATE()) GROUP BY HOSPITAL_NAME,HOSPITAL_CODE,PLATFORM ' +
        'ORDER BY HOSPITAL_CODE DESC ';

      logger.debug(sqlStr);
      return pool.query(sqlStr);
    })
    .then((res) => {
      data.arr = res.recordset;
      ctx.body = config.setResponseSuccess(data.arr.length || data.list.length ? data : null);
      sqlAmount.close();
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
