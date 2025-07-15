const glob = require("glob");
const path = require("path");
const { sep } = path; // 路径分隔符 兼容 win linux

/**
 * router-schema 加载器
 * @param {object} app
 * @returns
 *
 * 通过'json-schema & ajv'对 API 规则进行约束，配合 api-params-verify 中间件使用
 *
 * app/router-schema/**.js
 *
 * 输出:
 * app.routerSchema = {
 *  'api-name': {}
 */
module.exports = (app) => {
  // 读取 router-schema 目录下的所有文件
  const schemaPath = path.resolve(app.businessDir, `.${sep}router-schema`);
  const fileList = glob.sync(
    path.resolve(schemaPath, `.${sep}**${sep}*.js`),
  );

  let routerSchema = {};
  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });

  app.routerSchema = routerSchema;
};
