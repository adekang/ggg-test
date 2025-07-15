module.exports = (app) => {
  const BaseController = require("./base")(app);

  return class ProjectController extends BaseController {
    /**
     * 获取项目列表
     * @param {*} ctx ctx 上下文
     */
    async getList(ctx) {
      const { project: projectService } = this.service;
      const list = await projectService.getList();
      this.success(ctx, list);
    }
  };
};
