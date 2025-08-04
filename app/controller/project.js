module.exports = (app) => {
  const BaseController = require("./base")(app);

  return class ProjectController extends BaseController {
    /**
     * 根据 projectKey 获取项目peizhi详情
     */
    async get(ctx){
      const { proj_key: projKey } = ctx.request.query;
      const { project: projectService } = app.service;

      const projectConfig= projectService.get(projKey);
      if(!projectConfig){
        return this.fail(ctx, "项目不存在");
      }
      return this.success(ctx, projectConfig);
    }

    /**
     * 获取当前 peojectKey 换取模型下的项目列表（没有就全量获取）
     */
    async getList(ctx) {
      const { proj_key: projKey } = ctx.request.query;
      const { project: projectService } = app.service;
      const projectList = await projectService.getList({ projKey });
      const dtoProjectList = projectList.reduce((cur, item) => {
        const { modelKey, key, name, desc, homePage } = item;
        cur.push({ modelKey, key, name, desc, homePage });
        return cur;
      }, []);

      return this.success(ctx, dtoProjectList);
    }

    /**
     * 获取所有模型与项目的结构化数据
     */
    async getModelList(ctx) {
      const { project: projectService } = app.service;
      const modelList = await projectService.getModelList();
      // 构造返回结果，只返回关键数据
      const dtoModelList = modelList.map((item) => {
        const { model, project } = item;

        // 构造 model 关键数据
        const { key, name, desc } = model;
        const dtoModel = { key, name, desc };

        // 构造 project 关键数据
        const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
          const { key, name, desc, homePage } = project[projKey];
          preObj[projKey] = { key, name, desc, homePage };
          return preObj;
        }, {});

        // 整合返回结构
        return {
          model: dtoModel,
          project: dtoProject,
        };
      });
      this.success(ctx, dtoModelList);
    }
  };
};
