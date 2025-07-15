const Ajv = require("ajv");
const ajv = new Ajv();
/**
 * API 参数校验
 */
module.exports = (app) => {
  const $schema = "http://json-schema.org/draft-07/schema#";

  return async (ctx, next) => {
    if (ctx.path.indexOf("/api") !== 0) {
      return await next();
    }
    // 获取请求参数
    const { query, body, headers } = ctx.request;
    const { params, path, method } = ctx;

    app.logger.info("[-- api-params-verify --]", `path: ${path}`);
    app.logger.info("[-- api-params-verify --]", `method: ${method}`);
    app.logger.info(
      "[-- api-params-verify --]",
      `headers: ${JSON.stringify(headers)}`,
    );
    app.logger.info(
      "[-- api-params-verify --]",
      `query: ${JSON.stringify(query)}`,
    );
    app.logger.info(
      "[-- api-params-verify --]",
      `params: ${JSON.stringify(params)}`,
    );
    app.logger.info(
      "[-- api-params-verify --]",
      `body: ${JSON.stringify(body)}`,
    );

    const schema = app.routerSchema[path]?.[method.toLowerCase()];

    if (!schema) {
      return await next();
    }

    let valid = true;
    let validate;
    // 校验 headers
    if (valid && headers && schema.headers) {
      schema.headers.$schema = $schema;
      validate = ajv.compile(schema.headers);
      valid = validate(headers);
    }

    // 校验 body
    if (valid && body && schema.body) {
      schema.body.$schema = $schema;
      validate = ajv.compile(schema.body);
      valid = validate(body);
    }

    // 校验 query
    if (valid && query && schema.query) {
      schema.query.$schema = $schema;
      validate = ajv.compile(schema.query);
      valid = validate(query);
    }

    // 校验 params
    if (valid && params && schema.params) {
      schema.params.$schema = $schema;
      validate = ajv.compile(schema.params);
      valid = validate(params);
    }

    if (!valid) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        code: 442,
        message: `参数校验失败::${ajv.errorsText(validate.errors)}`,
      };
      return;
    }

    await next();
  };
};
