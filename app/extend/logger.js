const log4js = require("log4js");

/**
 * 日志工具
 * @param {*} app
 * 外部调用 app.logger.info
 */
module.exports = (app) => {
  let logger;
  if (app.env.isLocal()) {
    // 打印在控制台
    logger = console;
  } else {
    // 把日志输出到文件
    log4js.configure({
      appenders: {
        console: { type: "console" },
        // 日志文件切分
        dateFile: {
          type: "dateFile",
          filename: "./logs/application.log",
          pattern: "yyyy-MM-dd",
        },
      },
      categories: {
        default: {
          appenders: ["console", "dateFile"],
          level: "trace",
        },
      },
    });
    logger = log4js.getLogger();
  }
  return logger;
};
