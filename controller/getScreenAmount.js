const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      const sqlStr =
        'SELECT * ' +
        "FROM (SELECT A.name, amt, numtp , CASE WHEN A.name='汇总' THEN 99999 ELSE 1 END AS sort, " +
        "B.HTOTAL AS '医院' " +
        'FROM T_TRADE_TOTAL  A ' +
        'INNER JOIN ( ' +
        "SELECT COUNT(1) + 128 AS HTOTAL, '汇总' AS name " +
        'FROM TBS_PAL ' +
        'WHERE BIT4 =1 AND ISUSE =1 ' +
        'UNION ' +
        "SELECT COUNT(0) AS HTOTAL,REPLACE(city,'市','') AS name FROM TBS_PAL WHERE BIT4 = 1 AND ISUSE =1 GROUP BY DISTID,city " +
        ') B on A.NAME=B.name) AS SourceTable ' +
        'PIVOT( SUM(amt) FOR NUMTP IN ([日],[周],[月],[年],[累计])) AS A ' +
        'UNION ' +
        "SELECT '惠州' AS name, 1 AS sort , 128 AS  '医院' , 0 AS [日], 0 AS [周], 0 AS [月], 0 AS [年], 0 AS [累计] " +
        'UNION ' +
        "SELECT '江门' AS name, 1 AS sort , 0 AS  '医院' , 0 AS [日], 0 AS [周], 0 AS [月], 0 AS [年], 0 AS [累计] " +
        'UNION ' +
        "SELECT '湛江' AS name, 1 AS sort , 0 AS  '医院' , 0 AS [日], 0 AS [周], 0 AS [月], 0 AS [年], 0 AS [累计] " +
        'UNION ' +
        "SELECT '茂名' AS name, 1 AS sort , 0 AS  '医院' , 0 AS [日], 0 AS [周], 0 AS [月], 0 AS [年], 0 AS [累计] " +
        'ORDER BY sort,[年] DESC ';

      logger.info('经营数据');
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
