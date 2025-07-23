const merge = require("webpack-merge");
const path = require("path");
const baseConfig = require("./webpack.base.js");
const HappyPack = require("happypack");
const os = require("os");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

// 多线程 build 设置

const happyPackCommonConfig = {
  debug: true,
  threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
};

/**
 * 生产环境配置
 */
const webpackConfig = merge.smart(baseConfig, {
  mode: "production",
  module: {
    // 多线程打包
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "happypack/loader?id=css"],
    }, {
      test: /\.js$/,
      include: path.resolve(process.cwd(), "./app/pages"),
      use: ["happypack/loader?id=js"],
    }],
  },
  // 生产环境的 output 配置
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.join(process.cwd(), "./app/public/dist/prod"),
    publicPath: "/dist/prod",
    crossOriginLoading: "anonymous",
  },
  performance: {
    hints: false,
  },
  plugins: [
    // build 前 清空 public/dist
    new CleanWebpackPlugin(['public/dist'],{
      root:path.resolve(process.cwd(), "./app/"),
      exclude:[],
      verbose:true,
      dry:true, // 不删除文件
    }),
    // 提取css公共部分 （非公共部分使用 inline）
    new MiniCssExtractPlugin({
      chunkFilename: "css/[name]_[chunkhash:8].bundle.css",
    }),
    // 优化压缩 css
    new CSSMinimizerPlugin(),
    // 多线程打包 js
    new HappyPack({
      ...happyPackCommonConfig,
      id: "js",
      loaders: [`babel-loader?${JSON.stringify({
        presets: [
          "@babel/preset-env",
        ],
        plugins: [
          "@babel/plugin-transform-runtime",
        ],
      })}`],
    }),
    // 多线程打包 css
    new HappyPack({
      ...happyPackCommonConfig,
      id: "css",
      loaders: [{
        path: "css-loader",
        options: {
          importLoaders: 1,
        },
      }],
    }),
    // 浏览器在请求资源时，不发送用户的凭证
    new HtmlWebpackInjectAttributesPlugin({
        crossorigin: "anonymous",
    }),
  ],
  optimization:{
    // 压缩
    minimize:true,
    minimizer: [
      new TerserWebpackPlugin({
        cache:true, // 开启缓存
        parallel:true, // 多线程压缩
        terserOptions:{
          compress:{
            drop_console:true, // 压缩时删除 console.log
          }
        }
      }),
    ],
  }
});

module.exports = webpackConfig;
