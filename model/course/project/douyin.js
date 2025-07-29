module.exports = {
  name: "抖音课堂",
  desc: "抖音课堂管理系统",
  homePage:"",
  menu: [
        {
      key:"video",
      name:"视频管理(抖音课堂)",
    },
    {
      key:"user",
      name:"课程管理(抖音课堂)",
    },
    {
      key: "traffic",
      name: "流量管理",
      menuType: "module",
      moduleType: "sider",
      siderConfig: {
        menu: [
          {
            key: "user-traffic",
            name: "学员流量",
            menuType: "module",
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
        ],
      },
    },
  ],
};
