<template>
  <el-config-provider :locale="zhCn">
    <HeaderView
      :proj-name="projName"
      @menu-select="onMenuSelect"
    >
      <template #main-content>
        <router-view />
      </template>
    </HeaderView>
  </el-config-provider>
</template>

<script setup>
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useRoute, useRouter } from "vue-router";
import HeaderView from "./complex-view/header-view/header-view.vue";
import $curl from "$common/curl";
import { useMenuStore } from "$store/menu";
import { useProjectStore } from "$store/project";
import { onMounted, ref } from "vue";

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const projectStore = useProjectStore();
const projName = ref("");

onMounted(() => {
    getProjectList();
    getProjctConfig();
});

async function getProjectList() {
    const res = await $curl({
        url: "/api/project/list",
        method: "get",
        query: {
            proj_key: route.query.proj_key,
        },
    });
    if (!res || !res.success) {
        return;
    }
    projectStore.setProjectList(res.data);
}

async function getProjctConfig() {
    const res = await $curl({
        url: "/api/project",
        method: "get",
        query: {
            proj_key: route.query.proj_key,
        },
    });
    if (!res || !res.success) {
        return;
    }
    const { name, menu } = res.data;
    projName.value = name;
    menuStore.setMenuList(menu);
}

function onMenuSelect(menu) {
    const { moduleType, key, customConfig } = menu;
    // 如果是当前页面不处理
    if (key === route.query.key) {
        return;
    }
    const pathMap = new Map([
        ["sider", "/sider"],
        ["iframe", "/iframe"],
        ["schame", "/schame"],
        ["custom", customConfig?.path],
    ]);

    router.push({
        path: pathMap.get(moduleType),
        query: {
            key: key,
            proj_key: route.query.proj_key,
        },
    });
}
</script>

<style lang="less" scoped></style>
