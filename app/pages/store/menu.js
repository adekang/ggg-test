import { defineStore } from "pinia";
import { ref } from "vue";
import {first} from "lodash";

export const useMenuStore = defineStore("menu", () => {
  // 项目列表
  const menuList = ref([]);

  // 设置项目列表
  const setMenuList = (list) => {
    menuList.value = list;
  };

  /**
   * 找出菜单目录
   * @param {*} param0  搜索字段
   * @param {*} mList  搜索值
   */
  const findMenuItem = function ({ key, value }, mList = menuList.value) {
    for (let i = 0; i < mList.length; i++) {
      const item = mList[i];
      if (!item) continue;

      const { menuType, moduleType } = item;

      if (item[key] === value) {
        return item;
      }

      if (menuType === "group" && item.subMenu) {
        const mItem = findMenuItem({ key, value }, item.subMenu);
        if (mItem) return mItem;
      }

      if (moduleType === "sider" && item.siderConfig && item.siderConfig.menu) {
        const mItem = findMenuItem({ key, value }, item.siderConfig.menu);
        if (mItem) return mItem;
      }
    }
  };

    /**
   * 返回第一个菜单,如果是group的话，就返回第一个子group菜单
   * @param mList 菜单列表
   */
  const findFirstMenuItem = function (mList = menuList.value) {
    if (!mList || !first(mList)) return
    let firstMenuItem = first(mList)
    //group的情况
    if (firstMenuItem?.subMenu) {
      firstMenuItem = findFirstMenuItem(firstMenuItem.subMenu)
    }
    return firstMenuItem
  }

  return {
    menuList,
    setMenuList,
    findMenuItem,
    findFirstMenuItem
  };
});
