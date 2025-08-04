module.exports = (app,router) => {
  // 配置静态根目录
  const {project: projectController}  = app.controller
  router.get('/api/project/model_list',projectController.getModelList.bind(projectController));

  // 获取列表
  router.get('/api/project/list',projectController.getList.bind(projectController))

  // 获取详情
  router.get('/api/project',projectController.get.bind(projectController))
};
