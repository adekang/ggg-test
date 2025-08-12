module.exports = {
  model: "pdd",
  name: "拼多多",
  homePage: "/schema?proj_key=pdd&key=product",
  menu: [
    {
      key: "product",
      name: "商品管理(pdd)",
    },
    {
      key: "order",
      name: "订单管理(pdd)",
    },
    {
      key: "client",
      name: "客户管理(pdd)",
      moduleType: "schema",
      schemaConfig: {
        api: "/api/client",
        schema:""
      }
    },
    {
      key: "data",
      name: "数据分析(pdd)",
      menuType: "module",
      moduleType: "sider",
      siderConfig: {
        menu: [
          {
            key: "coupanalysison",
            name: "电商罗盘",
            menuType: "module",
            moduleType:'custom',
            customConfig: {
              path: "/todo",
            },
          },
          {
            key:'sider-search',
            name:'信息查询',
            moduleType:'iframe',
            iframeConfig:{
                path:'http://127.0.0.1:3000/view/dashboard#/sider/iframe?key=data&proj_key=pdd&sider_key=sider-search'
            }
          },
        ],
      },
    },
  ],
};
