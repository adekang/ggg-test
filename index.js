const Koa = require('koa');

const app = new Koa();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

app.listen(port, host, () => {
  console.log(`Server started: http://${host}:${port}`);
});