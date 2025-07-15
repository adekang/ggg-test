const path = require("path");
const { sep } = path; // 路径分隔符 兼容 win linux

/**
 * @file config.js
 * @description 配置加载器
 * @param {object} app koa 实例
 *
 * 加载所有配置文件，配置文件位于 app/config 目录下
 * 通过 env.config 覆盖 default.config 加载到 app.config 上
 * 例子
 * app/config/config.default.js
 * app/config/config.env.js
 * app/config/config.test.js
 * app/config/config.prod.js
 */

module.exports = (app) => {
  const configPath = path.resolve(app.baseDir, `.${sep}config`);

  let defaultConfig = {};
  try {
    defaultConfig = require(
      path.resolve(configPath, `.${sep}config.default.js`),
    );
  } catch (error) {
    console.error(`[ Error loading default config ]: ${error.message}`);
  }
  // 获取 env.config
  let envConfig = {};
  try {
    if (app.env.isLocal()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.local.js`));
    } else if (app.env.isBeta()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`));
    } else if (app.env.isProd()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`));
    }
  } catch (error) {
    console.error(
      `[ Error loading environment config ]: ${error.message}. Using default config.`,
    );
  }

  app.config = Object.assign({}, defaultConfig, envConfig);
};
