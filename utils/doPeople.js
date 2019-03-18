/**
 * @description 操作影人表
 */
'use strict';

const sql = require('../sql');
const logger = require('../logger');

//  校验影人是否存在影人表里
const check = (did, name) => {
  return new Promise((resolve) => {
    sql.query('select id from douban_people where d_id = ?', [did], (error, res) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else if (res && res.length) {
        resolve(res[0].id);
      } else if (name) {
        sql.query(
          'select id from douban_people where d_id IS NOT NULL AND name = ?',
          [name],
          (nameError, nameRes) => {
            if (nameError) {
              logger.error(nameError);
              reject(nameError);
            } else if (nameRes && nameRes.length) {
              resolve(nameRes[0].id);
            } else {
              resolve(null);
            }
          },
        );
      } else {
        resolve(null);
      }
    });
  });
};

//  插入影人
const insert = (data) => {
  const form = {
    d_id: data.id,
    name: data.name,
    type: data.type,
    images: data.images,
    update_time: new Date(),
  };
  return new Promise((resolve, reject) => {
    sql.query('INSERT INTO douban_people SET ?', form, (error, res) => {
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
