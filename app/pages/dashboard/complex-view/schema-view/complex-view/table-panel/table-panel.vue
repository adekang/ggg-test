<template>
  <el-card class="table-panel">
    <!--  表格右上方的操作按钮  -->
    <el-row
      v-if="tableConfig?.headerButtons?.length > 0"
      justify="end"
      class="operation-panel"
    >
      <el-button
        v-for="item in tableConfig?.headerButtons"
        v-bind="item"
        @click="operationHandler({btnConfig:item})"
      >
        {{ item?.label }}
      </el-button>
    </el-row>

    <schema-table
      ref="schemaTableRef"
      :schema="tableSchema"
      :api="api"
      :api-params="apiParams"
      :buttons="tableConfig?.rowButtons ?? []"
      @operate="operationHandler"
    />
  </el-card>
</template>

<script setup>
import $curl from '$common/curl';
import SchemaTable from "$widget/schema-table/schema-table.vue";
import {ElMessageBox, ElNotification} from "element-plus";
import {first, last} from "lodash";
import {inject, ref} from "vue";


// 相当于useContext，去获取provider的东西
const {
  api,
  apiParams,
  tableSchema,
  tableConfig
} = inject('schemaViewData')

const emit = defineEmits(['operate'])
const schemaTableRef = ref(null)

// 此层级中，table的按钮的handlerMap，如果这一层没有理应网上继续浮
const EventHandlerMap = {
  remove: removeData
}

async function loadTableData() {
  await schemaTableRef.value.loadTableData()
}

async function initTableData() {
  await schemaTableRef.value.initTableData()
}

/**
 * 处理操作按钮的点击事件
 * @param btnConfig
 * @param rowData
 */
async function operationHandler({btnConfig, rowData}) {
  const {eventKey} = btnConfig
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({btnConfig, rowData})
  } else {
    emit('operate', {btnConfig, rowData})
  }
}

/**
 *
 * @param buttonConfig
 * @param rowData
 */
function removeData({btnConfig, rowData}) {
  /**
   * btnConfig: {
   *   label: '',
   *     eventKey: '',s
   *   eventOption: {
   *   params: {
   *     paramKey: rowValueKey，这里rowValueKey按照'schema::tableKey'的格式去写"::"后面则为当前这一行数据中的某个属性的key值
   *   }
   *   },
   *   ...elButtonConfig
   * }
   */
  const {eventOption} = btnConfig
  if (!eventOption?.params) return
  const {params} = eventOption

  const removeKey = first(Object.keys(params))


  let removeValue
  //移除某条信息时，需要传递的数据的key值
  const removeValueList = params[removeKey].split('::')
  if (first(removeValueList) === 'schema' && last(removeValueList)) {
    removeValue = rowData[last(removeValueList).trim()]
  }

  ElMessageBox.confirm(
    `确认删除 ${removeKey} 为 ${removeValue} 的数据？`,
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }
  ).then(async () => {
    if (schemaTableRef.value?.showLoading) {
      schemaTableRef.value.showLoading()
    } else {
      console.error('showLoading method not found on schemaTableRef')
    }
    const res = await $curl({
      method: 'delete',
      url: api.value,
      data: {
        [removeKey]: removeValue
      },
      errorMessage: '删除失败'
    })
    schemaTableRef.value.hideLoading()
    if (!res || !res?.success || !res?.data) return
    ElNotification({
      title: '删除成功',
      message: '删除成功',
      type: 'success',
    })

    //重新加载表格数据
    await initTableData()
  })
}

//向上暴露方法、数据
defineExpose({
  loadTableData
})

</script>

<style scoped lang="less">
.table-panel {
  flex: 1;
  margin: 10px;

  .operation-panel {
    margin-bottom: 10px;
  }
}

:deep(.el-card__body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>