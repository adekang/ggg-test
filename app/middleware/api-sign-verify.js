const md5 = require("md5");

/**
 * API 签名校验
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // 只对api 请求做签名校验
    if (ctx.path.indexOf("/api") !== 0) {
      return await next();
    }

    const { path, method } = ctx;
    const { headers } = ctx.request;

    const { s_sign: sSign, s_t: st } = headers;

    const signKey ="adekang"
    const signature = md5(`${signKey}_${st}`)

    app.logger.info(`[api-sign-verify] path: ${path}, method: ${method}, signature: ${signature}`)

    if(!sSign || !st || signature !== sSign.toLowerCase() || Date.now() - st > 1000 * 60 * 5) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 4000,
        message: "sign 失效",
      };
      return;
    }
    await next();
  };
};
