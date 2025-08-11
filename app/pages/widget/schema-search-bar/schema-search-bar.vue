<template>
  <el-form
    v-if="schema && schema"
    :inline="true"
    class="schema-search-bar"
  >
    <el-form-item>
      <!--   动态组件   -->
      <el-form-item
        v-for="(schemaItem,key) in schema.properties"
        :key="key"
        :label="schemaItem.label"
      >
        <component
          :is="searchItemConfig[schemaItem?.option?.comType]?.component"
          :ref="handleSearchComList"
          :schema-key="key"
          :schema="schemaItem"
          @loaded="handleChildLoaded"
        />
      </el-form-item>
    </el-form-item>

    <!--   操作区域   -->
    <el-form-item>
      <el-button
        type="primary"
        plain
        class="search-btn"
        @click="search"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        plain
        class="reset-btn"
        @click="reset"
      >
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {ref, toRefs} from "vue";
import searchItemConfig from "./schema-item-config";

const props = defineProps({
  /**
   * schema配置如下
   * {
   *  type: 'object',//表示schema这个属性为object类型
   *  properties: {
   *    key: {//字段名
   *      ...schema,//标准jsonschema配置
   *      type: '',//字段类型
   *      label: '',//字段的中文字
   *      //字段在 search-bar 中的相关配置
   *      option: {
   *        ...elComponentConfig,//标准的 el-component-column 配置
   *        comType: '',// 此组件的类型，这个字段的搜索有可能是input类型，有可能是picker类型
   *        default: ''// 默认值
   *      }
   *    }
   *  }
   *}
   */
  schema: Object
})
const {schema} = toRefs(props)

const emit = defineEmits(["load", 'search', 'reset']);

const searchComList = ref([])

/**
 * 这个函数是赋值给动态组件component的，当有一个组件相应的时候他回来调取此函数
 * @param el
 */
const handleSearchComList = (el) => {
  searchComList.value.push(el)
}

const getValue = () => {
  let dtoObj = {}
  searchComList?.value?.forEach(component => {
    dtoObj = {
      ...dtoObj,
      ...component?.getValue()
    }
  })
  return dtoObj
}

//所有组件的load
let childComponentLoadCount = 0;
const handleChildLoaded = () => {
  childComponentLoadCount++
  if (childComponentLoadCount >= Object.keys(schema?.value?.properties)?.length) {
    emit('load', getValue())
  }
}

const search = () => {
  emit("search", getValue());
}

/**
 * 重置所有搜索条件
 * 遍历子组件列表，并调用其暴露出来的reset方法
 */
const reset = () => {
  searchComList.value?.forEach(component => component?.reset())
  emit("reset");
}

defineExpose({
  reset
})
</script>

<!--为什么没有scoped？是因为我希望里面的内容是全局的，这样我就可以直接在一个文件维护里面的样式-->
<style lang="less">
.schema-search-bar {
  min-width: 500px;

  .input,
  .select,
  .dynamic-select {
    width: 180px;
  }

  .search-btn {
    width: 100px;
  }

  .reset-btn {
    width: 100px;
  }
}
</style>