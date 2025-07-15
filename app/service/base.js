const superagent = require('superagent');

module.exports = (app) => {
  return class BaseService {
    /**
     * 基础服务
     * 统一收拢 service 公共方法
     */
    constructor() {
      this.app = app;
      this.config = app.config;
      this.curl = superagent
    }
  };
};
