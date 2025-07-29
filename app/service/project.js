module.exports = (app) => {
  const BaseService = require("./base")(app);
  const modelList = require("../../model/index.js")(app);

  return class ProjectService extends BaseService {
    /**
     * 获取项目列表
     */
    async getModelList() {
      return modelList;
    }
  };
};
