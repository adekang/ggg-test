import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMenuStore = defineStore('menu', () => {
    // 项目列表
    const menuList = ref([]);

    // 设置项目列表
    const setMenuList = (list) => {
        menuList.value = list;
    }

    return {
        menuList,
        setMenuList
    };
});