const router = require('koa-router')();

//  获取token
const wechatCheck = require('../wechat/check');

//  获取豆瓣250，直接调用豆瓣接口
const getDoubanTop250 = require('../controller/getDoubanTop250');

const path = {
  wechatCheck: '/wechat/check',
  getDoubanTop250: '/get/douban/top250',
};

router.get(path.wechatCheck, wechatCheck.run);
router.get(path.getDoubanTop250, getDoubanTop250.run);

module.exports = {
  router,
};
