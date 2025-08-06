<template>
  <HeaderContainer :title="projName">
    <template #menu-content>
      <el-menu
        :default-active="activeKey"
        :ellipsis="false"
        mode="horizontal"
        @select="handleSelect"
      >
        <template v-for="item in menuStore.menuList">
          <sub-menu
            v-if="item.subMenu && item.subMenu.length > 0"
            :key="item.key"
            :menu-item="item"
          />
          <el-menu-item
            v-else
            :index="item.key"
          >
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #setting-content>
      <el-dropdown @command="handleProjectCommand">
        <span class="project-list">{{ projName }}
          <el-icon
            v-if="projectStore.projectList.length > 1"
            class="el-icon--right"
          >
            <ArrowDown />
          </el-icon>
        </span>

        <template
          v-if="projectStore.projectList.length > 1"
          #dropdown
        >
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in projectStore.projectList"
              :key="item.key"
              :command="item.key"
              :disabled="item.name === projName"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>

    <template #main-content>
      <slot name="main-content" />
    </template>
  </HeaderContainer>
</template>

<script setup>
import HeaderContainer from "$widget/header-container/header-container.vue";
import { useRoute } from "vue-router";
import SubMenu from "./complex-view/sub-menu/sub-menu.vue";
import { useMenuStore } from "$store/menu";
import { useProjectStore } from "$store/project";
import { onMounted, ref, watch } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";

const route = useRoute();
const menuStore = useMenuStore();
const projectStore = useProjectStore();

const activeKey = ref("");

const setActiveKey = function () {
    const menuItem = menuStore.findMenuItem({
        key: "key",
        value: route.query.key,
    });
    activeKey.value = menuItem?.key;
};

watch(
    () => route.query.key,
    () => {
        setActiveKey();
    },
);

watch(
    () => menuStore.menuList,
    () => {
        setActiveKey();
    },
);

defineProps({
    projName: {
        type: String,
        default: "项目名称",
    },
});

const emit = defineEmits(["menu-select"]);

onMounted(() => {
    setActiveKey();
});

function handleSelect(menuKey) {
    const menuItem = menuStore.findMenuItem({
        key: "key",
        value: menuKey,
    });

    emit("menu-select", menuItem);
}

function handleProjectCommand(event) {
    const projectItem = projectStore.projectList.find(
        (item) => item.key === event,
    );

    if (!projectItem || !projectItem.homePage) return;

    const { origin, pathname } = window.location;

    window.location.replace(`${origin}${pathname}#${projectItem.homePage}`);
    window.location.reload();
}
</script>

<style lang="less" scoped>
:deep(.el-menu--horizontal.el-menu) {
    border-bottom: 0;
}

.project-list {
    margin-right: 20px;
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
    outline: none;
}
</style>
