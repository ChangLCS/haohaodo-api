const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  let name = ctx.query.name || 0;
  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
      let sqlStr = '';
      if (Number(name) === 0) {
        //  如果是查看全部的时候
        sqlStr =
          'SELECT * FROM ( ' +
          "SELECT 'HOSPITAL' AS TYPE, COUNT(0) + 128 AS NUM, '全部' AS PLATFORM FROM TBS_PAL WHERE BIT4 = 1 AND ISUSE = 1 " +
          'UNION ' +
          "SELECT 'AGENCY' AS TYPE, COUNT(0) AS NUM, '全部' AS PLATFORM FROM (SELECT DISTINCT PEI_SONG_QI_YE_CODE FROM T_TRADE_ORDER) A " +
          'UNION ' +
          "SELECT 'PRODUCE' AS TYPE, COUNT(0) AS NUM, '全部' AS PLATFORM FROM (SELECT DISTINCT producer_id FROM T_TRADE_ORDER_ITEMS) A " +
          'UNION ' +
          "SELECT 'ORDER' AS TYPE, COUNT(0) AS NUM, '全部' AS PLATFORM FROM T_TRADE_ORDER " +
          'UNION ' +
          "SELECT 'DRUGS' AS TYPE, COUNT(0) AS NUM, '全部' AS PLATFORM FROM TBS_GOODS WHERE GOODSCODE IS NOT NULL AND ISUSE=1 " +
          ') AS A PIVOT (SUM(A.NUM) FOR TYPE IN ([HOSPITAL],[AGENCY],[PRODUCE],[DRUGS],[ORDER])) AS C ';
      } else {
        //  如果分平台查看
        let tradeName = '';
        switch (name) {
          case '深圳':
            tradeName = 'TRADESZ';
            break;
          case '东莞':
            tradeName = 'TRADEDG';
            break;
          case '肇庆':
            tradeName = 'TRADEZQ';
            break;
          case '珠海':
            tradeName = 'TRADEZH';
            break;
          case '河源':
            tradeName = 'TRADEHY';
            break;
          case '哈尔滨':
          case '黑龙江':
            tradeName = 'TRADEHEB';
            name = '哈尔滨';
            break;
          default:
            break;
        }

        if (config.isProvince(name)) {
          //  如果是省的话
          const cityArr = `SELECT DISTINCT REPLACE(city,'市','') FROM TBS_PAL WHERE BIT4 = 1 AND ISUSE = 1 AND provincename = '${name}省' `;
          sqlStr =
            'SELECT * FROM ( ' +
            `SELECT 'HOSPITAL' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM TBS_PAL WHERE BIT4 = 1 AND ISUSE = 1 AND provincename = '${name}省' ` +
            'UNION ' +
            `SELECT 'AGENCY' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM (SELECT DISTINCT PEI_SONG_QI_YE_CODE FROM T_TRADE_ORDER WHERE PLATFORM IN ( ` +
            cityArr +
            ')) AS A ' +
            'UNION ' +
            `SELECT 'PRODUCE' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM (SELECT DISTINCT producer_id FROM T_TRADE_ORDER_ITEMS WHERE PLATFORM IN ( ` +
            cityArr +
            ')) AS A ' +
            'UNION ' +
            `SELECT 'ORDER' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM T_TRADE_ORDER WHERE PLATFORM IN ( ` +
            cityArr +
            ') ' +
            'UNION ' +
            `SELECT 'DRUGS' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM TBS_GOODS WHERE GOODSCODE IS NOT NULL AND ISUSE=1 ` +
            ') AS A PIVOT (SUM(A.NUM) FOR TYPE IN ([HOSPITAL],[AGENCY],[PRODUCE],[DRUGS],[ORDER])) AS C ';
        } else if (name === '惠州') {
          sqlStr =
            'SELECT * FROM ( ' +
            `SELECT 'HOSPITAL' AS TYPE, 42 AS NUM, '${name}' AS PLATFORM ` +
            'UNION  ' +
            `SELECT 'AGENCY' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM (SELECT DISTINCT PEI_SONG_QI_YE_CODE FROM T_TRADE_ORDER WHERE PLATFORM = '${name}') A ` +
            'UNION ' +
            `SELECT 'PRODUCE' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM (SELECT DISTINCT producer_id FROM T_TRADE_ORDER_ITEMS WHERE PLATFORM = '${name}') A ` +
            'UNION ' +
            `SELECT 'ORDER' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM T_TRADE_ORDER WHERE PLATFORM = '${name}' ` +
            'UNION ' +
            `${
              tradeName
                ? `SELECT 'DRUGS' AS TYPE, NUM, '${name}' AS PLATFORM FROM OPENQUERY(${tradeName},'select count(0) as NUM from tms_drugs where up_status = 1') `
                : `SELECT 'DRUGS' AS TYPE, 0 AS NUM, '${name}' AS PLATFORM`
            }` +
            ') AS A PIVOT (SUM(A.NUM) FOR TYPE IN ([HOSPITAL],[AGENCY],[PRODUCE],[DRUGS],[ORDER])) AS C ';
        } else {
          sqlStr =
            'SELECT * FROM ( ' +
            `SELECT 'HOSPITAL' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM TBS_PAL WHERE BIT4 = 1 AND ISUSE = 1 AND city LIKE '%${name}%' ` +
            'UNION  ' +
            `SELECT 'AGENCY' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM (SELECT DISTINCT PEI_SONG_QI_YE_CODE FROM T_TRADE_ORDER WHERE PLATFORM = '${name}') A ` +
            'UNION ' +
            `SELECT 'PRODUCE' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM (SELECT DISTINCT producer_id FROM T_TRADE_ORDER_ITEMS WHERE PLATFORM = '${name}') A ` +
            'UNION ' +
            `SELECT 'ORDER' AS TYPE, COUNT(0) AS NUM, '${name}' AS PLATFORM FROM T_TRADE_ORDER WHERE PLATFORM = '${name}' ` +
            'UNION ' +
            `${
              tradeName
                ? `SELECT 'DRUGS' AS TYPE, NUM, '${name}' AS PLATFORM FROM OPENQUERY(${tradeName},'select count(0) as NUM from tms_drugs where up_status = 1') `
                : `SELECT 'DRUGS' AS TYPE, 0 AS NUM, '${name}' AS PLATFORM`
            }` +
            ') AS A PIVOT (SUM(A.NUM) FOR TYPE IN ([HOSPITAL],[AGENCY],[PRODUCE],[DRUGS],[ORDER])) AS C ';
        }
      }

      logger.info(sqlStr);

      return pool.query(sqlStr);
    })
    .then((res) => {
      const data = res.recordset[0];

      ctx.body = config.setResponseSuccess(data || {});
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
