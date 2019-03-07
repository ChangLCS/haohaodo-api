const sha1 = require('sha1');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const token = config.wechat.token;
  const signature = ctx.query.signature;
  const nonce = this.query.nonce;
  const timestamp = this.query.timestamp;
  const echostr = this.query.echostr;

  logger.debug(token, signature, nonce, timestamp, echostr);

  let str = [token, timestamp, nonce].sort().join('');
  let sha = sha1(str);
  logger.debug(sha, signature);
  if (sha == signature) {
    this.body = echostr;
  } else {
    this.body = 'wrong';
  }

  next();
};

module.exports = { run };
