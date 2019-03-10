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
// app.use(async (ctx, next) => {
//   logger.trace(`${ctx.ip}----${ctx.url}`);

// if (router.noTokenPath.indexOf(ctx.path) === -1) {
//   const token = ctx.query.accessToken;
//   await jwt.verify(token, 'secret', async (err) => {
//     if (err) {
//       logger.error('token 失效', err);
//       ctx.body = config.setResponseError('没有token或者token已过期', 401);
//     } else {
//       await next();
//     }
//   });
// } else {
// await next();
// }
// });

app.use(bodyParser());
app.use(router.router.routes());
app.use(router.router.allowedMethods());

app.use(async (ctx, next) => {
  logger.trace(`${ctx.ip}----${ctx.url}`);
  logger.debug(ctx);
  await next();
});

app.listen(3000, () => {
  logger.debug('server listen: ----- 3000');
});
