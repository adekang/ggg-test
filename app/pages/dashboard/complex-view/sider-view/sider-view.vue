<template>
  <sider-container>
    <!--  菜单列表  -->
    <template #menu-content>
      <el-menu
        :default-active="activeKey"
        :ellipsis="false"
        @select="onMenuSelect"
      >
        <template v-for="item in menuList">
          <!-- group -->
          <sub-menu
            v-if="item.subMenu && item.subMenu.length>0"
            :menu-item="item"
          />
          <!-- module -->
          <el-menu-item
            v-else
            :index="item.key"
          >
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>

    <!--  主要内容  -->
    <template #main-content>
      <router-view />
    </template>
  </sider-container>
</template>

<script setup>
import { useMenuStore } from "$store/menu";
import SiderContainer from "$widget/sider-container/sider-container";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SubMenu from "./complex-view/sub-menu/sub-menu";

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();


/**
 * 侧边菜单栏切换
 */
const onMenuSelect = function (menuKey) {
    handleMenuSelect(menuKey);
}

/**
 * 选中目标MenuKey
 * @param menuKey
 */
const handleMenuSelect = function (menuKey) {
    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: menuKey
    })
    const { moduleType, key, customConfig } = menuItem

    // 如果当前选中的菜单就是当前路由的sider_key，那么不需要跳转
    if (key === route.query.sider_key) return

    const pathMap = {
        iframe: '/iframe',
        schema: '/schema',
        custom: customConfig?.path
    }

    console.log("handleMenuSelect::", {
        moduleType,
        key,
        customConfig,
        pathMap,

    });

    console.log("router::", router.getRoutes());


    router.push({
        path: `/sider${pathMap[moduleType]}`,
        query: {
            key: route.query.key,
            proj_key: route.query.proj_key,
            sider_key: key,
        }
    })
}

const menuList = ref([]);
/**
 * 获取菜单列表数据
 */
const setMenuList = function () {
    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: route.query.key
    })
    if (menuItem?.siderConfig?.menu) {
        menuList.value = menuItem?.siderConfig?.menu || []
    }
}

const activeKey = ref("");
/**
 * 设置高亮
 */
const setActiveKey = function () {
    let siderMenuItem = menuStore.findMenuItem({
        key: 'key',
        value: route.query.sider_key
    })

    //首次加载siderConfig的话，那么用户是还没点击路由还没有sider_key的，所以默认第一个
    if (!siderMenuItem) {
        const headerMenuItem = menuStore.findMenuItem({
            key: 'key',
            value: route.query.key
        })
        if (headerMenuItem?.siderConfig?.menu) {
            const siderMenuList = headerMenuItem?.siderConfig?.menu
            siderMenuItem = menuStore.findFirstMenuItem(siderMenuList)
            if (siderMenuItem) {
                handleMenuSelect(siderMenuItem?.key)
            }
        }
    }

    activeKey.value = siderMenuItem?.key
}

watch(() => route.query.key, () => {
    if (route.query.key) {
        setMenuList()
        setActiveKey()
    }
}, { immediate: false })

watch(() => menuStore.menuList, () => {
    if (route.query.key) {
        setMenuList()
        setActiveKey()
    }
}, { deep: true, immediate: false })

onMounted(() => {
    if (route.query.key) {
        setMenuList()
        setActiveKey()
    }
})
</script>

<style scoped lang="less"></style>