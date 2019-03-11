/**
 * @description 获取高分电影排名
 */
'use strict';

const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

//  获取前250的列表
const getList = (start) =>
  new Promise((resolve, reject) => {
    sql.query(
      `SELECT * FROM douban_movie WHERE id <= 250 ORDER BY id LIMIT ${start},20;`,
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      },
    );
  });

const run = async (ctx, next) => {
  const page = Number(ctx.query.page) || 0;
  const start = page * 20;

  try {
    logger.trace('开始id', start + 1);
    const data = await getList(start);
    ctx.body = config.setResponseSuccess(data);
  } catch (error) {
    ctx.body = config.setResponseError(error);
  }

  await next();
};

module.exports = { run };
