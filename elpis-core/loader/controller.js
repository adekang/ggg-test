const glob = require("glob");
const path = require("path");
const { sep } = path; // 路径分隔符 兼容 win linux

/**
 * @param {object} app koa 实例
 * @returns
 *
 * 加载所有 controller ,通过 'app.controller.${目录}.${文件名}' 访问
 *
 * 例子
 * app/controller/auth/auth-controller.js
 *
 * ===> app.controller.auth.authController
 */
module.exports = (app) => {
  // 读取 controller 目录下的所有文件
  const controllerPath = path.resolve(app.businessDir, `.${sep}controller`);
  const fileList = glob.sync(
    path.resolve(controllerPath, `.${sep}**${sep}**.js`),
  );

  const controllers = {};

  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);

    // 截取路径
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf("."),
    );

    // 改驼峰的模式 auth-controller => authController
    name = name.replace(/-(\w)/g, function ($1) {
      return $1[1].toUpperCase();
    });

    // 挂载 controller 到 app 上
    let tempControllers = controllers;
    const nameList = name.split(sep);


    for (let i = 0, len = nameList.length; i < len ; ++i) {
      if(i === len -1){
        const ControllerModule = require(path.resolve(file))(app);
        tempControllers[nameList[i]] = new ControllerModule();
      }else{
        if (!tempControllers[nameList[i]]) {
          tempControllers[nameList[i]] = {};
        }
        tempControllers = tempControllers[nameList[i]];
      }
    }

  });
  app.controller = controllers;
  return {};
};
