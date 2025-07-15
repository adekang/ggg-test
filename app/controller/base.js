module.exports = (app) => {
  return class BaseController {
    /**
     * 基础控制器
     * @param {*} ctx ctx 上下文
     */
    constructor(){
      this.app = app;
      this.config = app.config;
      this.service = app.service;
    }

    /**
     * API 处理成功时统一返回结构
     * @param {object} ctx ctx 上下文
     * @param {object} data 数据
     * @param {object} metadata 元数据
     */
    success(ctx,data={},metadata ={}){
      ctx.status = 200;
      ctx.body = {
        success: true,
        data,
        metadata,
      };
    }

    /**
     * API 处理失败时统一返回结构
     * @param {object} ctx ctx 上下文
     * @param {object} message 错误消息
     * @param {number} code 错误码
     */
    fail(ctx,message={},code=0){
      ctx.status = 200;
      ctx.body = {
        success: false,
        message,
        code,
      };
    }
  }
};
