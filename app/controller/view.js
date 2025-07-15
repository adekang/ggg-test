module.exports = (app) => {

  return class ViewController {
    async renderPage(ctx) {
      await ctx.render(`dist/entry.${ctx.params.page}`,{
        name:app.options?.name
      });
    }
  }
};
