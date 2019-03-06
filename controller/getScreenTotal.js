const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      const sqlStr =
        'SELECT * FROM (SELECT * FROM T_DATA_CNT) AS A PIVOT (SUM(A.CNT) FOR DTYPE IN ([1],[2],[3],[4],[5],[6])) AS C';

      logger.info('1生产企业 2经营企业 3医疗机构  4中成药 5 西药 6 产品');
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
