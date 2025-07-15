const glob = require("glob");
const path = require("path");
const { sep } = path; // 路径分隔符 兼容 win linux

/**
 * @param {object} app koa 实例
 * @returns
 *
 * 加载所有 middleware ,通过 'app.middleware.${目录}.${文件名}' 访问
 *
 * 例子
 * app/middleware/auth/auth-middleware.js
 *
 * ===> app.middleware.auth.authMiddleware
 */
module.exports = (app) => {
  // 读取 middleware 目录下的所有文件
  const middlewarePath = path.resolve(app.businessDir, `.${sep}middleware`);
  const fileList = glob.sync(
    path.resolve(middlewarePath, `.${sep}**${sep}**.js`),
  );

  const middlewares = {};

  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);

    // 截取路径
    name = name.substring(
      name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
      name.lastIndexOf("."),
    );

    // 改驼峰的模式 auth-middleware => authMiddleware
    name = name.replace(/-(\w)/g, function ($1) {
      return $1[1].toUpperCase();
    });
    // 挂载 middleware 到 app 上
    let tempMiddlewares = middlewares;
    const nameList = name.split(sep);


    for (let i = 0, len = nameList.length; i < len ; ++i) {
      if(i === len -1){
        tempMiddlewares[nameList[i]] = require(path.resolve(file))(app);
      }else{
        if (!tempMiddlewares[nameList[i]]) {
          tempMiddlewares[nameList[i]] = {};
        }
        tempMiddlewares = tempMiddlewares[nameList[i]];
      }
    }
  });
  app.middlewares = middlewares;
};
