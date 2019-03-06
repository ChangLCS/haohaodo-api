const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const top = ctx.query.top || 0;

  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      const sqlStr = `SELECT TOP ${top} B.provincename,B.city, A.ERPCREATETIME, SUM(A.QTY) AS QTY, A.SUPPLIERNAME, A.SUPPLIERID FROM TSC_FLOWQRY A INNER JOIN TBS_PAL B ON A.SUPPLIERID = B.PALID WHERE A.TYPE = 1 GROUP BY B.provincename,B.city, A.ERPCREATETIME, A.SUPPLIERNAME, A.SUPPLIERID ORDER BY A.ERPCREATETIME DESC`;

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
