  const glob = require("glob");
  const path = require("path");
  const { sep } = path; // 路径分隔符 兼容 win linux

  /**
   * @param {object} app koa 实例
   * @returns
   *
   * 加载所有 service ,通过 'app.service.${目录}.${文件名}' 访问
   *
   * 例子
   * app/service/auth/auth-service.js
   *
   * ===> app.service.auth.authService
   */
  module.exports = (app) => {
    // 读取 service 目录下的所有文件
    const servicePath = path.resolve(app.businessDir, `.${sep}service`);
    const fileList = glob.sync(
      path.resolve(servicePath, `.${sep}**${sep}**.js`),
    );

    const services = {};

    fileList.forEach((file) => {
      // 提取文件名称
      let name = path.resolve(file);

      // 截取路径
      name = name.substring(
        name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
        name.lastIndexOf("."),
      );

      // 改驼峰的模式 auth-service => authService
      name = name.replace(/-(\w)/g, function ($1) {
        return $1[1].toUpperCase();
      });
      // 挂载 service 到 app 上
      let tempServices = services;
      const nameList = name.split(sep);


      for (let i = 0, len = nameList.length; i < len ; ++i) {
        if(i === len -1){
        const ServiceModule = require(path.resolve(file))(app);
         tempServices[nameList[i]] = new ServiceModule();
        }else{
          if (!tempServices[nameList[i]]) {
            tempServices[nameList[i]] = {};
          }
          tempServices = tempServices[nameList[i]];
        }
      }
    });
    app.service = services;
  };
