/**
 * @description 操作电影表
 */
'use strict';

const sql = require('../sql');
const logger = require('../logger');

//  校验电影是否存在电影表里
const check = (did) => {
  return new Promise((resolve) => {
    sql.query('select id from douban_movie where d_id = ?', [did], (error, res) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        if (res && res.length) {
          resolve(res[0].id);
        } else {
          resolve(null);
        }
      }
    });
  });
};

//  插入电影
const insert = (data) => {
  const form = {
    d_id: data.id,
    title: data.title,
    original_title: data.original_title,
    aka: data.aka,
    years: data.years,
    summary: data.summary,
    rating: data.rating,
    images: data.images,
    casts: data.casts,
    directors: data.directors,
    genres: data.genres,
    update_time: new Date(),
  };
  return new Promise((resolve, reject) => {
    sql.query('INSERT INTO douban_movie SET ?', form, (error, res) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        resolve(res.insertId);
      }
    });
  });
};

module.exports = {
  check,
  insert,
};
