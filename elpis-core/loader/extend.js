const glob = require("glob");
const path = require("path");
const { sep } = path; // 路径分隔符 兼容 win linux

/**
 * @param {object} app koa 实例
 * @returns
 *
 * 加载所有 extend ,通过 'app.extend.${文件名}' 访问
 *
 * 例子
 * app/extend/auth-extend.js
 *
 * ===> app.extend.authExtend
 */
module.exports = (app) => {
  // 读取 extend 目录下的所有文件
  const extendPath = path.resolve(app.businessDir, `.${sep}extend`);
  const fileList = glob.sync(
    path.resolve(extendPath, `.${sep}**${sep}**.js`),
  );

  const extend = {};

  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);

    // 截取路径
    name = name.substring(
      name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      name.lastIndexOf("."),
    );

    // 改驼峰的模式 auth-controller => authController
    name = name.replace(/-(\w)/g, function ($1) {
      return $1[1].toUpperCase();
    });

    // 过滤 app 已经存在的 key
    for (const key in app) {
      if (key === name) {
        console.warn(
          `[ Warning ]: extend key "${name}" already exists in app, skipping.`,
        );
        return;
      }
    }
    app[name] = require(path.resolve(file))(app);
  });
  app.extend = extend;
  return {};
};
