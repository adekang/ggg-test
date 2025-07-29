const path = require("path");

module.exports = (app) => {
  // 配置静态根目录
  const koaStatic = require("koa-static");
  app.use(koaStatic(path.join(process.cwd(), "./app/public")));
  const koaNunjucks = require("koa-nunjucks-2");

  app.use(koaNunjucks({
    ext: "tpl",
    path: path.join(process.cwd(), "./app/public"),
    nunjucksConfig: {
      noCache: true,
      trimBlocks: true,
    },
  }));

  // 引入 ctx.body 解析中间件
  const bodyParser = require("koa-bodyparser");
  app.use(bodyParser({
    formLimit: "100mb",
    enableTypes: ["json", "form", "text"],
  }));

  // 引入 异常捕获中间件
  app.use(app.middlewares.errorHandler);

  // 引入 API 签名校验中间件
  app.use(app.middlewares.apiSignVerify);

  // 引入 API 参数校验中间件
  app.use(app.middlewares.apiParamsVerify);
};
