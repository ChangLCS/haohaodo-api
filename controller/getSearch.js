/**
 * @description 电影查询列表
 */
'use strict';

const axios = require('axios');
const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const doMovie = require('../utils/doMovie');

const getDoubanTop250 = require('./getDoubanTop250');

//  获取储存完成的列表
const getList = (ids) =>
  new Promise((resolve, reject) => {
    sql.query(
      `SELECT * FROM douban_movie WHERE id IN (${ids || 0}) ORDER BY rating DESC,years DESC;`,
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
  const value = ctx.query.value || '';
  const page = Number(ctx.query.page) || 0;
  const start = page * 20;

  await axios
    .get('https://api.douban.com/v2/movie/search', {
      params: {
        q: value,
        start,
      },
    })
    .then(async (res) => {
      const movies = res.data.subjects;
      const ids = [];
      try {
        for (let i = 0; i < movies.length; i += 1) {
          const item = movies[i];
          let id = await doMovie.check(item.id);
          if (!id) {
            id = await getDoubanTop250.insertData(item);
          }
          ids.push(id);
        }
        logger.trace('查找的电影id', ids.join(','));
        const data = await getList(ids.join(','));
        ctx.body = config.setResponseSuccess(data);
      } catch (error) {
        ctx.body = config.setResponseError(error);
      }

      await next();
    })
    .catch((err) => {
      logger.error(err);
    });
};

module.exports = { run };
