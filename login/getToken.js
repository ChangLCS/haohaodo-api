const jwt = require('jsonwebtoken');

const checkCode = require('./checkCode');

const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const key = ctx.query.key || '';
  if (!key) {
    ctx.body = config.setResponseError('没有key', 401);
    logger.error(ctx.body);
    next();
    return;
  }

  //  验证的是与流向的登录用户
  await checkCode(key)
    .then((res) => {
      const canAccess = res.data.data.canAccess;
      if (canAccess) {
        const token = jwt.sign(
          {
            data: key,
          },
          'secret',
          { expiresIn: 60 * 60 * 24 * 7 },
          //  七天的有效token
        );
        logger.debug(token);
        ctx.body = config.setResponseSuccess(token);
      } else {
        ctx.body = config.setResponseError('验证失败，重新登录', 401);
      }
      next();
    })
    .catch((res) => {
      logger.error(res.data);
    });
};

module.exports = { run };
