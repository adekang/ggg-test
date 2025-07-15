/**
 * 异常错误处理兜底
 * @param {object} app
 */
module.exports = (app) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const { status, message, detail } = err;
      app.logger.info(JSON.stringify(err));
      app.logger.error("[--- 错误 ---]", err);
      app.logger.error("[--- 错误 ---]", status, message, detail);
      if(message && message.indexOf('template not found') > -1) {
        // 页面重定向
        ctx.status = 301;
        ctx.redirect(`${app.options?.homePage || '/'} `);
        return;
      }
      const resBody = {
        success: false,
        code: 5000,
        message: "网络错误",
      };
      ctx.status = 200;
      ctx.body = resBody;
    }
  };
};
