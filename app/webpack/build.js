const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const webBaseConfig = require("./config/webpack.base.js");

// 删除 app/public/dist 目录

function removeDist() {
  const distPath = path.resolve(process.cwd(), "./app/public/dist");
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true });
  }
}

removeDist()

webpack(webBaseConfig, (err, stats) => {
  if (err) {
    console.log(err);
    return;
  }
  process.stdout.write(stats.toString({
    colors: true, // 彩色输出信息
    modules: false, // 不显示每个模块的打包的信息
    children: false, // 不显示子编译任务的信息
    chunks: false, // 不显示每个代码块的信息
    chunkModules: true, // 显示代码块中的模块的信息
  }));
});
