<template>
  <iframe
    :src="path"
    class="iframe"
  />
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute} from 'vue-router'
import {useMenuStore} from "$store/menu";

const route = useRoute()
const menuStore = useMenuStore()
const path = ref('')

watch([
  () => route.query.key,
  () => route.query.sider_key,
  () => menuStore.menuList
], () => {
  setPath()
}, {deep: true})

onMounted(() => {
  setPath()
})

const setPath = function () {
  const {key, sider_key: siderKey} = route.query
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: siderKey || key
  })
  path.value = menuItem?.iframeConfig?.path ?? ''
}
</script>

<style scoped lang="less">
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>