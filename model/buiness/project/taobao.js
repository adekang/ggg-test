module.exports = {
  model: "taobao",
  name: "电商电商系统",
  homePage: "",
  menu: [{
    key: "order",
    menuType: "iframe",
    customConfig: {
      path: "https://www.baidu.com",
    },
  }, {
    key: "operation",
    name: "运营管理",
    menuType: "module",
    moduleType: "sider",
    siderConfig: {
      menu: [
        {
          key: "coupon",
          name: "优惠券",
          menuType: "module",
          moduleType: "custom",
          customConfig: {
            path: "/todo",
          },
        },
        {
          key: "limited",
          name: "限量购",
          menuType: "module",
          moduleType: "custom",
          customConfig: {
            path: "/todo",
          },
        },
        {
          key: "festival",
          name: "节日活动",
          menuType: "module",
          moduleType: "custom",
          customConfig: {
            path: "/todo",
          },
        },
      ],
    },
  }, {
    key: "order",
    name: "订单管理",
    menuType: "module",
    moduleType: "custom",
    customConfig: {
      path: "/todo",
    },
  }, {
    key: "client",
    name: "客户管理",
    menuType: "module",
    moduleType: "custom",
    customConfig: {
      path: "/todo",
    },
  }],
};
