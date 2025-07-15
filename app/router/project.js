module.exports = (app,router) => {
  // 配置静态根目录
  const {project: projectController}  = app.controller
  router.get('/api/project/list',projectController.getList.bind(projectController));

};
