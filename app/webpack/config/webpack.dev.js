const merge = require("webpack-merge");

const baseConfig = require("./webpack.base.js");

/**
 * 开发环境配置
 */
const webpackConfig = merge.smart(baseConfig, {
  mode: "development",
  // 生产环境的 output 配置
  output: {
  },
});

module.exports = webpackConfig;
