<template>
  <el-row class="schema-view">
    <!--  搜索区  -->
    <search-panel
      v-if="searchSchema?.properties && !!Object.keys(searchSchema?.properties)?.length"
      @search="onSearch"
      @load="onLoad"
    />

    <!--  表格区  -->
    <table-panel
      ref="tablePanelRef"
      @operate="onTableOperate"
    />

    <!-- <component
      :is="ComponentConfig[key]?.component"
      v-for="(item,key) in components"
      :key="key"
      ref="comListRef"
      @command="onComponentCommand"
    /> -->
  </el-row>
</template>

<script setup>
import {provide, ref} from "vue";
import SearchPanel from './complex-view/search-panel/search-panel';
import TablePanel from './complex-view/table-panel/table-panel';
import {useSchema} from './hooks/schema';
// import ComponentConfig from "./components/component-config";

const {
  api,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components
} = useSchema()

/**
 * API的请求参数
 * @type Object
 */
const apiParams = ref({})
const tablePanelRef = ref(null)
const comListRef = ref([])//所有动态组件

provide('schemaViewData', {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components
})

/**
 * table事件映射
 * @type {{}}
 */
const eventHandlerMap = {
  showComponent
}

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj
}

const onLoad = (searchValObj) => {

}

/**
 * 表格中每行后面的操作按钮的点击事件会一层层往上浮，逐层拦截，如果没拦截住这里是最后的兜底
 * @param btnConfig 当前按钮的config，如果该按钮的eventKey命中了eventHandlerMap则调用其方法
 * @param rowData
 */
const onTableOperate = ({btnConfig, rowData}) => {
  const {eventKey} = btnConfig
  if (eventHandlerMap[eventKey]) {
    return eventHandlerMap[eventKey]({btnConfig, rowData})
  }
}

/**
 * 响应组件事件,使得组件中抛出指令，让schemaView做某些操作：如loadTableData
 * @param data
 */
const onComponentCommand = (data) => {
  const {event} = data
  switch (event) {
    case 'loadTableData':
      tablePanelRef?.value?.loadTableData()
  }
}

/**
 * 调起动态组件中 组件自己的show方法
 * @param btnConfig
 * @param rowData
 */
function showComponent({btnConfig, rowData}) {
  const {comName} = btnConfig?.eventOption
  if (!comName) {
    console.log(`btnConfig中没有配置eventOption的comName`);
    return
  }
  //从配置的动态组件中找到要显示的组件，注意：item.name 是动态组件中暴露出去的（也就是动态组件需要defineExpose一个name属性出去）
  const currentComponentRef = comListRef.value?.find(item => item?.name === comName)
  if (!currentComponentRef || typeof currentComponentRef?.show !== "function") {
    console.error(`找不到comName为${comName}的组件`);
  }
  currentComponentRef.show(rowData)
}
</script>

<style scoped lang="less">
.schema-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>