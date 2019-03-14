const router = require('koa-router')();

//  微信公众号服务器验证
const wechatCheck = require('../wechat/check');
//  小程序通过code获取用户openid，并生成token
const getToken = require('../login/getToken');

//  获取用户信息，进行存储
const setUserInfo = require('../login/setUserInfo');

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
  getToken: '/get/token',

  setUserInfo: '/set/user/info',

  getDoubanTop250: '/get/douban/top250',
  getMovieItem: '/get/movie/item',
  getRand: '/get/rand',
  getSearch: '/get/search',
};

router.get(path.wechatCheck, wechatCheck.run);
router.get(path.getToken, getToken.run);

router.post(path.setUserInfo, setUserInfo.run);

router.get(path.getDoubanTop250, getDoubanTop250.run);
router.get(path.getMovieItem, getMovieItem.run);
router.get(path.getRand, getRand.run);
router.get(path.getSearch, getSearch.run);

module.exports = {
  router,
  noTokenPath: [path.wechatCheck, path.getToken],
};
