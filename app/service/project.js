module.exports = (app) => {
  const BaseService = require("./base")(app);
  const modelList = require("../../model/index.js")(app);

  return class ProjectService extends BaseService {

    /**
     * 根据 projectKey 获取项目配置
     */
    get(projKey){
      let projectConfig
      modelList.forEach((item) => {
        if (item.project[projKey]) {
          projectConfig = item.project[projKey];
        }
      })
      return projectConfig
    }
    /**
     * 获取当前 peojectKey 换取模型下的项目列表（没有就全量获取）
     */
    async getList({ projKey }) {
      return modelList.reduce((preList, modelItem) => {
        const { project } = modelItem;
        if (projKey && !project[projKey]) return preList;
        for (const pKey in project) {
          preList.push(project[pKey]);
        }
        return preList;
      }, []);
    }
    /**
     * 获取项目列表
     */
    async getModelList() {
      return modelList;
    }
  };
};
