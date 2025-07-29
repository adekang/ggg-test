module.exports = {
  name: "哔哩哔哩",
  desc: "哔哩哔哩管理系统",
  homePage: "",
  menu: [
    {
      key:"video",
      name:"视频管理(哔哩哔哩)",
    },
    {
      key:"user",
      name:"课程管理(哔哩哔哩)",
    },
    {
      key: "course",
      name: "课程资料",
      menuType: "module",
      moduleType: "sider",
      siderConfig: {
        menu: [
          {
            key: "pdf",
            name: "PDF资料",
            menuType: "module",
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
          {
            key: "execl",
            name: "EXCEL资料",
            menuType: "module",
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
          {
            key: "ppt",
            name: "PPT资料",
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
