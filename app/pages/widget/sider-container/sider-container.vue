<template>
  <el-container class="sider-container">
    <!--  左侧菜单栏  -->
    <el-aside
      width="200px"
      class="aside"
    >
      <slot name="menu-content" />
    </el-aside>

    <!--  主内容  -->
    <el-main class="main">
      <slot name="main-content" />
    </el-main>
  </el-container>
</template>

<script setup>

</script>

<style scoped lang="less">
.sider-container {
  height: 100%;

  .aside {
    border-right: 1px solid #E8E8E8;
  }

  .main {
    overflow: scroll;
  }
}

:deep(.el-menu) {
  border-right: 0;
}
</style>