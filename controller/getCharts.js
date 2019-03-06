const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const type = ctx.query.type;
  let name = ctx.query.name || 0;
  if (!type) {
    ctx.body = config.setResponseError('请输入 type');
    return;
  }
  if (name === '黑龙江') {
    name = '哈尔滨';
  }

  let sqlStr = '';
  switch (Number(type)) {
    case 1: //    年销量趋势图
      sqlStr = `SELECT * FROM RPT1 WHERE PLATFORM = '${Number(name) === 0 ? '全部' : name}' `;
      break;
    case 2: //  医院排名
      sqlStr =
        `SELECT DISTINCT TOP 5 A.AMT,A.HOSPITAL_NAME AS PALNAME,'${
          Number(name) === 0 ? '全部' : name
        }' AS PLATFORM,C.SHORTNAME FROM ` +
        '(SELECT A.HOSPITAL_CODE,A.HOSPITAL_NAME,SUM(A.ORDER_TOTAL_AMOUNT) AS AMT FROM T_TRADE_ORDER A ' +
        `WHERE ${Number(name) === 0 ? '1=1' : ` PLATFORM='${name}'`} ` +
        'GROUP BY A.HOSPITAL_CODE,A.HOSPITAL_NAME) A ' +
        'INNER JOIN TBS_PAL B ON A.HOSPITAL_CODE = B.PALCODE ' +
        'INNER JOIN TBS_CUSTADDR C ON B.PALID = C.PALID ' +
        'ORDER BY A.AMT DESC ';
      break;
    case 3: //  药品销售占比排名
      sqlStr =
        'SELECT * FROM ( ' +
        `SELECT TOP 5 D.catalog_from_name SORTCODE,SUM(A.UNIT_PRICE * (A.NUM-A.close_num)) AS AMT,'${name ||
          '全部'}' AS PLATFORM FROM T_TRADE_ORDER_ITEMS A ` +
        'LEFT JOIN tbs_goods B ON A.DRUGSCODE=B.OGOODSCODE  ' +
        'LEFT JOIN T_TRADE_ORDER C ON A.ORDER_ID=C.ID AND A.PLATFORM=C.PLATFORM ' +
        'LEFT JOIN pms_catalog_from D ON B.SORTCODE=D.name ' +
        `WHERE ${
          Number(name) === 0 ? '1=1' : `C.PLATFORM='${name}'`
        } AND C.ID IS NOT NULL AND D.name IS NOT NULL AND YEAR(C.CREATE_DATE) = YEAR(GETDATE()) AND C.PROCESS_STAT_CODE <> 6 ` +
        'GROUP BY D.catalog_from_name ORDER BY SUM(A.product_TOTAL_AMOUNT) DESC ' +
        'UNION ' +
        `SELECT TOP 1 '全部' AS SORTCODE, AMT,NAME AS PLATFORM FROM T_TRADE_TOTAL WHERE NUMTP = '年' AND NAME = '${
          Number(name) === 0 ? '汇总' : name
        }' ` +
        ') A ORDER BY A.AMT DESC ';
      break;
    case 4: //  配送企业占比
      sqlStr =
        `SELECT TOP 5 ORDERBY = 0, PLATFORM = '${
          Number(name) === 0 ? '全部' : name
        }',T.PEI_SONG_QI_YE_NAME,AMOUNT = SUM(T.ORDER_TOTAL_AMOUNT),C.SHORTNAME FROM T_TRADE_ORDER T ` +
        'INNER JOIN TBS_PAL B ON T.PEI_SONG_QI_YE_CODE = B.PALCODE ' +
        'INNER JOIN TBS_CUSTADDR C ON B.PALID = C.PALID ' +
        `WHERE ${Number(name) === 0 ? '1=1' : ` T.PLATFORM='${name}'`} ` +
        'GROUP BY PEI_SONG_QI_YE_NAME,C.SHORTNAME ORDER BY AMOUNT DESC ';
      break;
    default:
      break;
  }

  const sqlrun = sql();

  await sqlrun
    .connect()
    .then((pool) => {
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
