const Koa = require('koa');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');
const cros = require('koa2-cors');

const logger = require('./logger');
const router = require('./router');
const config = require('./config');

const app = new Koa();

app.use(
  cros({
    origin: (ctx) => {
      return ctx.request.header.origin;
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 3600,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTION', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }),
);

//  打印ip，顺便验一下token
app.use(async (ctx, next) => {
  //  x-real-ip 是 nginx 代理前的原始ip
  logger.trace(`${ctx.header['x-real-ip'] || ctx.ip}----${ctx.host}----${ctx.url}`);

  if (router.noTokenPath.indexOf(ctx.path) === -1) {
    const token = ctx.query.accessToken;
    if (!token) {
      logger.error('没有token');
      ctx.body = config.setResponseError('请进行登录', 401);
    } else {
      await jwt.verify(token, config.tokenMsg, async (err, res) => {
        if (err) {
          logger.error('token 失效', err);
          ctx.body = config.setResponseError('登录已过期，请重新登录', 402);
        } else {
          //  将解密得到的用户id与sessionKey传进去方法里面
          ctx.query.serverUserId = res.userId;
          ctx.query.serverSessionKey = res.sessionKey;

          await next();
        }
      });
    }
  } else {
    await next();
  }
});

app.use(bodyParser());
app.use(router.router.routes());
app.use(router.router.allowedMethods());

app.use(async (ctx, next) => {
  await next();
});

app.listen(3000, () => {
  logger.debug('server listen: ----- 3000');
});
