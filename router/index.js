const router = require('koa-router')();

//  获取token
const wechatCheck = require('../wechat/check');

const path = {
  wechatCheck: '/wechat/check',
};

router.get(path.wechatCheck, wechatCheck.run);

module.exports = {
  router,
};
