const email = require('emailjs');

const sql = require('../sql');
const config = require('../config');
const logger = require('../logger');

const run = async (ctx, next) => {
  const body = ctx.request.body;

  const form = {
    text: body.text,
    from: body.from,
    to: body.to,
    subject: body.subject,
  };

  const server = email.server.connect({
    user: 'xxxxxxx@qq.com', // 你的QQ用户
    password: 'xxxxxxxxx', // 注意，不是QQ密码，而是刚才生成的授权码
    host: 'smtp.qq.com', // 主机，不改
    ssl: true, // 使用ssl
  });

  const sendFun = (resolve, reject) => {
    server.send(form, async (err, message) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(message);
        ctx.body = config.setResponseSuccess(message);
      }
    });
  };

  const fun = () => new Promise(sendFun);

  await fun()
    .then((res) => {
      ctx.body = config.setResponseSuccess(res);
      next();
    })
    .catch((res) => {
      ctx.body = config.setResponseError(res);
      next();
    });
};

module.exports = { run };
