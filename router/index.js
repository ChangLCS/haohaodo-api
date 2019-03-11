const router = require('koa-router')();

//  获取token
const wechatCheck = require('../wechat/check');

//  获取豆瓣250，直接调用豆瓣接口
const getDoubanTop250 = require('../controller/getDoubanTop250');
//  电影详情
const getMovieItem = require('../controller/getMovieItem');
//  获取高分电影排名
const getRand = require('../controller/getRand');
//  电影查询列表
const getSearch = require('../controller/getSearch');

const path = {
  wechatCheck: '/wechat/check',
  getDoubanTop250: '/get/douban/top250',
  getMovieItem: '/get/movie/item',
  getRand: '/get/rand',
  getSearch: '/get/search',
};

router.get(path.wechatCheck, wechatCheck.run);
router.get(path.getDoubanTop250, getDoubanTop250.run);
router.get(path.getMovieItem, getMovieItem.run);
router.get(path.getRand, getRand.run);
router.get(path.getSearch, getSearch.run);

module.exports = {
  router,
};
