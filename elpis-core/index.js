const Koa = require("koa");
const path = require("path");
const { sep } = path; // 路径分隔符 兼容 win linux
const env = require("./env");

const middlewareLoader = require("./loader/middleware");
const configLoader = require("./loader/config");
const serviceLoader = require("./loader/service");
const controllerLoader = require("./loader/controller");
const routerLoader = require("./loader/router");
const routerSchemaLoader = require("./loader/router-schema");
const extendLoader = require("./loader/extend");

module.exports = {
  /**
   * 项目启动
   * @param {*} options 启动参数
   * options = {
   *  name:"elpis-core", // 项目名称
   *  homePage: '/', // 首页路由
   * }
   */
  start: async function (options) {
    const app = new Koa();
    app.options = options;

    console.log(options);

    // 基础路径
    app.baseDir = process.cwd();

    // 业务文件路径
    app.businessDir = path.resolve(app.baseDir, `.${sep}app`);

    // 环境配置
    app.env = env(app);
    console.log(`-- [start] env: ${app.env.get()} --`);


    // 加载配置
    middlewareLoader(app);
    console.log("-- [start] middlewareLoader done --");

    // 注册全局 中间件
    try {
      require(`${app.businessDir}${sep}middleware.js`)(app);
      console.log("-- [start] Global middleware loaded --");
    } catch (error) {
      console.error(`[ Error loading global middleware ]: ${error.message}`);
    }


    configLoader(app);
    console.log("-- [start] configLoader done --");

    extendLoader(app);
    console.log("-- [start] extendLoader done --");

    serviceLoader(app);
    console.log("-- [start] serviceLoader done --");

    controllerLoader(app);
    console.log("-- [start] controllerLoader done --");

    routerLoader(app);
    console.log("-- [start] routerLoader done --");

    routerSchemaLoader(app);
    console.log("-- [start] routerSchemaLoader done --");

    try {
      const port = process.env.PORT || 3000;
      const host = process.env.HOST || "0.0.0.0";
      app.listen(port, host, () => {
        console.log(`Server started: http://${host}:${port}`);
      });
    } catch (error) {
      console.error(`[ Error starting server ]: ${error.message}`);
    }
  },
};
