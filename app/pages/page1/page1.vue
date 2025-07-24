<template>
  <h1>page1</h1>
  <el-button>你好</el-button>
</template>

<script setup>
import './index.css'
import curl from '$pages/common/curl'


curl({
  url: '/api/project/list',
  method: 'get',
  query:{
    proj_key:"123"
  }
}).then(res => {
  console.log("res::",res);
})

</script>

<style lang="less" scoped>

</style>