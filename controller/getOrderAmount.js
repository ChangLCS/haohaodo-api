const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const name = ctx.query.name;
  let key = name;
  if (!name && Number(name) !== 0) {
    ctx.body = config.setResponseError('没有参数 name');
    return;
  } else if (Number(name) === 0) {
    key = '汇总';
  }

  if (key === '黑龙江') {
    key = '哈尔滨';
  }

  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      let sqlStr =
        'SELECT ' +
        "CASE WHEN NUMTP = '累计' THEN 1 WHEN NUMTP = '年' THEN 2 WHEN NUMTP = '月' THEN 3 WHEN NUMTP = '周' THEN 4 WHEN NUMTP = '日' THEN 5 END AS TP , " +
        'AMT,NAME,NUMTP ' +
        `FROM T_TRADE_TOTAL WHERE NAME = '${key}'`;

      logger.info('数据汇总');
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
