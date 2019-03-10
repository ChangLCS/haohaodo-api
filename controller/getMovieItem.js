/**
 * @description 获取电影详情，如果 aka 且 summary 不存在，则调用豆瓣详情接口
 */
'use strict';

const axios = require('axios');
const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const doPeople = require('../utils/doPeople');

/**
 * @argument 获取影人表id
 * @type 1 导演 2 演员
 */
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

//  获取影人表信息
const getPeopleArr = (ids) =>
  new Promise((resolve) => {
    sql.query(`select * from douban_people where id in (${ids})`, (error, res) => {
      if (error) {
        logger.error(error.message);
      } else {
        resolve(res);
      }
    });
  });

//  豆瓣获取详情接口
const getDoubanItem = (form) =>
  new Promise((resolve, reject) => {
    const url = `https://api.douban.com/v2/movie/subject/${form.d_id}`;
    logger.debug('豆瓣获取详情接口', url);
    axios.get(url).then(async (res) => {
      const data = res.data;
      const casts = await getPeopleIds(data.casts, 2);

      const resForm = {
        ...form,
        aka: data.aka.join(','),
        countries: data.countries.join(','),
        summary: data.summary ? data.summary.replace('©豆瓣', '') : '',
        casts: casts.join(','),
      };
      //  更新详情
      const arr = [
        resForm.aka,
        resForm.countries,
        resForm.summary,
        resForm.casts,
        new Date(),
        form.id,
      ];
      sql.query(
        'update douban_movie set aka = ?,countries = ?,summary = ?,casts = ?, update_time = ? where id = ?',
        arr,
        (error) => {
          if (error) {
            reject(error.message);
          } else {
            resolve(resForm);
          }
        },
      );
    });
  });

//  获取真正的详情
const getItem = (id) =>
  new Promise((resolve) => {
    sql.query('select * from douban_movie where id = ?', [id], async (error, res) => {
      if (error) {
        logger.error(error);
        ctx.body = config.setResponseError(error.message);
      } else {
        let data = res[0];
        if (!data.aka && !data.summary) {
          data = await getDoubanItem(data);
        }

        const castsArr = await getPeopleArr(data.casts);
        const directorsArr = await getPeopleArr(data.directors);

        resolve({
          ...data,
          castsArr,
          directorsArr,
        });
      }
    });
  });

const run = async (ctx, next) => {
  const id = ctx.query.id;
  if (!id) {
    ctx.body = config.setResponseError('传入正确的id');
    return;
  }

  const data = await getItem(id);

  ctx.body = config.setResponseSuccess(data);
  await next();
};

module.exports = { run };
