module.exports = (app, router) => {
  const { business: businessController } = app.controller;

  router.get("/api/business/list", businessController.getList.bind(businessController));
};
