<template>
  <el-card class="search-panel">
    <!-- <schema-search-bar
      :schema="searchSchema"
      @load="onLoad"
      @search="onSearch"
      @reset="onReset"
    /> -->
  </el-card>
</template>

<script setup>
import {inject} from "vue";
// import SchemaSearchBar from "$widget/schema-search-bar/schema-search-bar.vue";

const {searchSchema} = inject('schemaViewData')

const emit = defineEmits(['search'])

/**
 * 当挂在完的时候每列都会带上自己的值
 * @param searchValObj
 */
const onLoad = (searchValObj) => {
  emit('load', searchValObj)
}

/**
 * @param searchValObj
 */
const onSearch = (searchValObj) => {
  emit('search', searchValObj)
}

const onReset = () => {
  emit('search', {})
}

</script>

<style scoped lang="less">
.search-panel {
  margin: 10px;
}

:deep(.el-card__body) {
  padding-bottom: 2px;
}
</style>