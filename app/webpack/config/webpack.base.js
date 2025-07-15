const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * webpack 基础配置
 */
module.exports = {
  // 入口配置
  entry: {
    "entry.page1": "./app/pages/page1/entry.page1.js",
    "entry.page2": "./app/pages/page2/entry.page2.js",
  },
  // 模块解析配置
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.js$/,
        type: "javascript/esm",
        include: [
          // 只对业务代码进行babel编译
          path.resolve(process.cwd(), "./app/pages"),
        ],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 300,
            esModule: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)(\?\S*)?$/,
        use: ["file-loader"],
      },
    ],
  },
  // 产物输出路径
  output: {
    path: path.join(process.cwd(), "./app/public/dist/prod"),
    filename: "js/[name]_[chunkhash:8].bundle.js",
    publicPath: "/dist/prod",
    crossOriginLoading: "anonymous",
  },
  // 模块解析的具体行为
  resolve: {
    extensions: [".js", ".vue", ".less", ".css"],
    alias: {
      $pages: path.resolve(process.cwd(), "./app/pages"),
    },
  },
  // 配置 插件
  plugins: [
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      Vue: "vue",
    }),
    // 定义全局变量
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false", // 生产环境下不支持vue-devtools
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false", // 生产环境下不支持hydration
    }),
    // 构造最终渲染的页面
    new HtmlWebpackPlugin({
      // 构造的html模板
      template: path.resolve(process.cwd(), "./app/view/entry.tpl"),
      // 产出的html文件名
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        "entry.page1.tpl",
      ),
      // 产出的html文件中引用的js文件
      chunks: ["entry.page1"],
    }),
    new HtmlWebpackPlugin({
      // 构造的html模板
      template: path.resolve(process.cwd(), "./app/view/entry.tpl"),
      // 产出的html文件名
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        "entry.page2.tpl",
      ),
      // 产出的html文件中引用的js文件
      chunks: ["entry.page2"],
    }),
  ],
  // 配置打包输出优化（代码分割 模块合并 缓存 压缩优化 tree shaking）
  optimization: {},
};
