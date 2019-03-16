const config = require('../config');
const wechatConfig = require('../wechat/config');
const logger = require('../logger');

const WXBizDataCrypt = require('../utils/WXBizDataCrypt'); //  微信解密得到unionid方法

const userInfo = require('./userInfo');

const run = async (ctx, next) => {
  const body = ctx.request.body;
  const userId = ctx.query.serverUserId;
  const sessionKey = ctx.query.serverSessionKey;

  const pc = new WXBizDataCrypt(wechatConfig.programID, sessionKey);
  const data = pc.decryptData(body.encryptedData, body.iv);

  const form = {
    ...data,
    id: userId,
  };

  try {
    await userInfo.updateUserInfo(form);
    ctx.body = config.setResponseSuccess();
  } catch (error) {
    logger.error(error.message);
    ctx.body = config.setResponseError(error.message);
  }
  await next();
};

module.exports = { run };
