/**
 * @description 获取豆瓣250，直接调用豆瓣接口
 */
'use strict';

const axios = require('axios');
const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const doPeople = require('../utils/doPeople');
const doMovie = require('../utils/doMovie');

const run = async (ctx, next) => {
  await axios
    .get('http://api.douban.com/v2/movie/top250', {
      params: {
        start: ctx.query.start || 0,
        count: 100,
      },
    })
    .then(async (res) => {
      const movies = res.data.subjects;

      //  获取影人表id
      const getPeopleIds = async (data, type) => {
        const ids = [];
        for (let i = 0; i < data.length; i += 1) {
          const item = data[i];
          let id = await doPeople.check(item.id);
          if (!id) {
            id = await doPeople.insert({
              ...item,
              images: item.avatars ? item.avatars.large : '',
              type,
            });
          }
          ids.push(id);
        }
        return ids;
      };

      //  插入电影表数据
      const insertData = async (data) => {
        const directors = await getPeopleIds(data.directors, 1); //  导演ids
        const casts = await getPeopleIds(data.casts, 2); //  演员ids

        const id = await doMovie.insert({
          ...data,
          aka: '',
          years: data.year,
          summary: '',
          rating: data.rating ? data.rating.average : '',
          images: data.images ? data.images.large : '',
          casts: casts.join(','),
          directors: directors.join(','),
          genres: data.genres.join(','),
        });
        return id;
      };

      for (let i = 0; i < movies.length; i += 1) {
        const item = movies[i];
        let id = await doMovie.check(item.id);
        if (!id) {
          id = await insertData(item);
        }
      }

      ctx.body = config.setResponseSuccess();
      await next();
    })
    .catch((err) => {
      logger.error(err);
    });
};

module.exports = { run };
