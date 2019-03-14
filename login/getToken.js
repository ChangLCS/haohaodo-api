const jwt = require('jsonwebtoken');
const axios = require('axios');

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

      let id = null;
      try {
        const data = await userInfo.getUserInfo(form);
        id = data.id;
      } catch (error) {
        id = await userInfo.insertUserInfo(form);
      }
      //  根据用户id，微信提供的session，加密合成access_token
      const token = jwt.sign(
        {
          userId: id,
          sessionKey: form.session_key,
        },
        config.tokenMsg,
        //  一天的有效token
        { expiresIn: 60 * 60 * 24 * 1 },
      );

      ctx.body = config.setResponseSuccess(token);
      await next();
    })
    .catch((error) => {
      logger.error(error);
    });
};

module.exports = { run };
