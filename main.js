const Koa = require('koa');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');

const logger = require('./logger');
const router = require('./router');
const config = require('./config');

const app = new Koa();

const ctxCallBack = (ctx) => {
  ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Max-Age', 3600);
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
  ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type');
};

//  打印ip，顺便验一下token
app.use(async (ctx, next) => {
  logger.trace(`${ctx.ip}----${ctx.url}`);

  ctxCallBack(ctx);

  if (router.noTokenPath.indexOf(ctx.path) === -1) {
    const token = ctx.query.accessToken;
    await jwt.verify(token, 'secret', async (err) => {
      if (err) {
        logger.error('token 失效', err);
        ctx.body = config.setResponseError('没有token或者token已过期', 401);
      } else {
        await next();
      }
    });
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
