const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");

const pageEntries = {};
const htmlWebpackPluginList = [];
// 获取 app/pages 目录下的所有入口文件
const entryList = path.resolve(process.cwd(), "./app/pages/**/entry.*.js");
glob.sync(entryList).forEach((file) => {
  const entryName = path.basename(file, ".js");
  // 构造entry
  pageEntries[entryName] = file;
  // 构造最终的渲染页面
  htmlWebpackPluginList.push(
    new HtmlWebpackPlugin({
      // 构造的html模板
      template: path.resolve(process.cwd(), "./app/view/entry.tpl"),
      // 产出的html文件名
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        `${entryName}.tpl`,
      ),
      // 产出的html文件中引用的js文件
      chunks: [entryName],
    }),
  );
});

/**
 * webpack 基础配置
 */
module.exports = {
  // 入口配置
  entry: pageEntries,
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
      $common: path.resolve(process.cwd(), "./app/pages/common"),
      $widget: path.resolve(process.cwd(), "./app/pages/widget"),
      $store: path.resolve(process.cwd(), "./app/pages/store"),
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
    ...htmlWebpackPluginList,
  ],
  // 配置打包输出优化（代码分割 模块合并 缓存 压缩优化 tree shaking）
  optimization: {
    /**
     * 将js打包成三类文件
     * 1. vendor 第三方库
     * 2. common 公共模块
     * 3. entry.{page} 业务代码
     */
    splitChunks: {
      chunks: "all", // 所有的chunk都进行代码分割
      maxAsyncRequests: 10, // 最大异步请求数
      maxInitialRequests: 10, // 最大初始化请求数
      cacheGroups: {
        // 缓存组
        vendor: {
          test: /[\\/]node_modules[\\/]/, // 第三方库
          name: "vendor",
          priority: 20, // 优先级
          enforce: true, // 强制使用
          reuseExistingChunk: true, // 复用已有的chunk

        },
        common: {
          name: "common",
          minChunks: 2, // 最少被引用2次
          minSize: 1, // 最小分割大小
          priority: 10, // 优先级
          reuseExistingChunk: true, // 复用已有的chunk
        },
      },
    },
  },
};
