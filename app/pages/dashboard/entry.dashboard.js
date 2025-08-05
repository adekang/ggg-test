import boot from "$pages/boot";
import dashboard from "./dashboard.vue";

const routes = [];

routes.push({
  path: "/iframe",
  component: () => import("./complex-view/iframe-view/iframe-view.vue"),
});
routes.push({
  path: "/schema",
  component: () => import("./complex-view/schema-view/schema-view.vue"),
});
// 自定义路由
routes.push({
  path: "/todo",
  component: () => import("./todo/todo-view.vue"),
});

routes.push({
  path: "/sider",
  component: () => import("./complex-view/sider-view/sider-view.vue"),
  children: [
    {
      path: "/iframe",
      component: () => import("./complex-view/iframe-view/iframe-view.vue"),
    },
    {
      path: "/schema",
      component: () => import("./complex-view/schema-view/schema-view.vue"),
    },
    // 自定义路由
    {
      path: "/todo",
      component: () => import("./todo/todo-view.vue"),
    },
  ],
});

// 侧边栏兜底策略
routes.push({
  path: "/sider/:chapters+",
  component: () => import("./complex-view/sider-view/sider-view.vue"),
});

boot(dashboard, { routes });
