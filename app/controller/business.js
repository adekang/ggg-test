module.exports = (app) => {
  const BaseController = require("./base")(app);

  return class BusinessController extends BaseController {

    async getList(ctx) {
      return this.success(ctx, [{
        product_id: 1,
        product_name: "Product 1",
        product_price: 90,
        product_inventory: 100,
        create_time: '2023-01-01 00:00:00'
      },
      {
        product_id: 2,
        product_name: "Product 2",
        product_price: 80,
        product_inventory: 200,
        create_time: '2023-01-02 00:00:00'
      }
    ],{
      total:2
    });
    }
  };
};
