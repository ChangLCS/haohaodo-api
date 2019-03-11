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
  logger.trace(`${ctx.header['x-real-ip'] || ctx.ip}----${ctx.host}----${ctx.url}`); //  x-real-ip 是 nginx 代理前的原始ip
  await next();
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
