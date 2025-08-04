<template>
  <el-config-provider :locale="zhCn">
    <HeaderView :proj-name="projName">
      <template #main-content>
        <span>测试</span>
      </template>
    </HeaderView>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import HeaderView from './complex-view/header-view/header-view.vue';
import $curl from '$common/curl';
import { useMenuStore } from '$store/menu';
import { useProjectStore } from '$store/project';
import { onMounted, ref } from 'vue';

const menuStore = useMenuStore();
const projectStore = useProjectStore();
const projName = ref('')

onMounted(() => {
  getProjectList()
  getProjctConfig()
})

async function getProjectList() {
  const res = await $curl({
    url: '/api/project/list',
    method: 'get',
    query: {
      proj_key: 'taobao'
    }
  })
  if (!res || !res.success) {
    return
  }
  projectStore.setProjectList(res.data)
}

async function getProjctConfig() {
  const res = await $curl({
    url: '/api/project',
    method: 'get',
    query: {
      proj_key: 'taobao'
    }
  })
  if (!res || !res.success) {
    return
  }

  console.log(res.data);

  const { name, menu } = res.data
  projName.value = name
  menuStore.setMenuList(menu)
}
</script>

<style lang="less" scoped></style>