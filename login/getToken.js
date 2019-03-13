const jwt = require('jsonwebtoken');

const axios = require('axios');
const sql = require('../sql');

const config = require('../config');
const wechatConfig = require('../wechat/config');
const logger = require('../logger');

const userInfo = require('./userInfo');

const run = async (ctx, next) => {
  const code = ctx.query.code;
  if (!code) {
    ctx.body = config.setResponseError('没有code', 401);
    logger.error(ctx.body);
    next();
    return;
  }

  await axios
    .get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: wechatConfig.programID,
        secret: wechatConfig.programSecret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    })
    .then(async (res) => {
      const form = res.data;
      logger.trace(form);
      let id = null;
      try {
        const data = await userInfo.getUserInfo(form);
        id = data.id;
      } catch (error) {
        id = await userInfo.insertUserInfo(form);
      }
      ctx.body = config.setResponseSuccess(id);
      await next();
    })
    .catch((error) => {
      logger.error(error);
    });

  //  验证的是与流向的登录用户
  // https: await checkCode(key)
  //   .then((res) => {
  //     const canAccess = res.data.data.canAccess;
  //     if (canAccess) {
  //       const token = jwt.sign(
  //         {
  //           data: key,
  //         },
  //         'secret',
  //         { expiresIn: 60 * 60 * 24 * 7 },
  //         //  七天的有效token
  //       );
  //       logger.debug(token);
  //       ctx.body = config.setResponseSuccess(token);
  //     } else {
  //       ctx.body = config.setResponseError('验证失败，重新登录', 401);
  //     }
  //     next();
  //   })
  //   .catch((res) => {
  //     logger.error(res.data);
  //   });
};

module.exports = { run };
