const koaRouter = require("koa-router");
const glob = require("glob");
const path = require("path");
const { sep } = path; // 路径分隔符 兼容 win linux
/**
 * @param {*} app
 *
 * 解析 app/router 目录下的所有路由文件 加载到 koaRouter 上
 */
module.exports = (app) => {
  // 找到文件路径
  const routerPath = path.resolve(app.businessDir, `.${sep}router`);

  const router = new koaRouter();
  // 注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`));
  fileList.forEach((file) => {
    // 提取文件名称
    require(path.resolve(file))(app, router);
  });

  // 路由兜底
  router.all("*", async (ctx) => {
    ctx.status = 302;
    ctx.redirect(`${app?.options?.homePage ?? "/"}`); // 重定向到首页或其他处理
  });

  // 路由注册到 app 上
  app.use(router.routes());
  app.use(router.allowedMethods());
};
