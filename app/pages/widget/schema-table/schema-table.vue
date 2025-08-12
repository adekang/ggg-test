<template>
  <div class="schema-table">
    <el-table
      v-if="schema && schema.properties"
      v-loading="loading"
      :data="tableData"
      class="table"
    >
      <!--  遍历列的数据  -->
      <template v-for="(schemaItem,key) in schema.properties">
        <!-- 此处v-bind含义为：把schemaItem.option全部展开绑定到el-table-column中 -->
        <el-table-column
          v-if="schema?.option?.visible !== false"
          :key="key"
          :prop="key"
          :label="schemaItem.label"
          v-bind="schemaItem.option"
        />
      </template>
      <!--  表格后面有列的操作  -->
      <el-table-column
        v-if="buttons?.length >0"
        label="操作"
        fixed="right"
        :width="operationWidth"
      >
        <!--  这里的scoped为作用于对象 能用于访问行、列的数据  -->
        <template #default="scoped">
          <el-button
            v-for="item in buttons"
            link
            v-bind="item"
            @click="operationHandler({btnConfig:item,rowData:scoped.row})"
          >
            {{ item?.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页栏目  -->
    <el-row
      justify="end"
      class="pagination"
    >
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10,20,50,100,200]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSizesChange"
        @current-change="onCurrentPageChange"
      />
    </el-row>
  </div>
</template>

<script setup>
import $curl from '$common/curl';
import {computed, nextTick, onMounted, ref, toRefs, watch} from "vue";

const props = defineProps({
  /**
   * schema配置如下：
   * {
   *   type: 'object',
   *   properties: {
   *     key: {
   *       ...schema,//标准jsonschema配置
   *       type: '',//字段类型
   *       label: '',//字段的中文字
   *       //字段在 table 中的相关配置
   *       option: {
   *         ...elTableColumnConfig,//标准的 el-table-column 配置
   *         visible: boolean,//默认为true（false 或不配置时，表示不在表单中显示）
   *       },
   *     }
   *   }
   * }
   */
  schema: Object,
  /**
   * 表格数据源的API（遵循Restful规范：GET /api/user）
   */
  api: String,
  /**
   * api请求参数
   */
  apiParams: Object,
  /**
   * buttons 操作按钮相关结构：如下
   * [{
   *   label:''//按钮中文名
   *   eventKey:''//按钮事件名
   *   eventOption:{} //按钮事件标准配置
   *   ...elButtonConfig //标准el-button 配置
   * },...]
   */
  buttons: Array
})

const {schema, api, buttons, apiParams} = toRefs(props)//转换成响应式数据

// 定义事件
const emit = defineEmits(['operate'])

const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(50)
const total = ref(0)
let timerId = null//用于节流控制，请求接口的频率

//操作按钮的总宽度
const operationWidth = computed(() => {
  const initWidth = 50
  return buttons?.value?.length > 0 ? buttons?.value?.reduce((pre, cur) => {
    return pre + cur.label?.length * 18
  }, initWidth) : initWidth
})

onMounted(() => {
  initData()
})

watch([schema, api, apiParams], () => {
  initData()
}, {deep: true})

/**
 * 对后端返回的数据进行渲染前的预处理
 * @param listData 列表数据
 * @returns {Promise<*>}
 */
const buildTableData = async (listData) => {
  if (!schema?.value?.properties) {
    return listData
  }
  return listData?.map(rowData => {
    for (const dKey in rowData) {
      //通过key找到对应的schema配置
      const schemaItem = schema.value.properties[dKey]
      //⬇️可以处理无限多的option配置

      //因为在useSchema中，已经对非"xxxOption"的字段进行提纯。tableOption被直接改名为option，所以schemaItem可以直接通过.option去访问
      //如果schema配置了toFixed
      if (schemaItem?.option?.toFixed) {
        //如果左边为真返回左边的，否则返回右边的
        rowData[dKey] = rowData[dKey].toFixed && rowData[dKey].toFixed(schemaItem.option.toFixed)
      }
    }
    return rowData
  })
}

/**
 * 请求表格数据的接口方法
 * @returns {Promise<void>}
 */
const fetchTableData = async () => {
  if (!api.value) return
  if (loading.value) return

  showLoading()

  //请求数据
  const res = await $curl({
    method: 'get',
    url: `${api.value}/list`,
    query: {
      ...apiParams.value,
      page: currentPage.value,
      size: pageSize.value,
    }
  })

  hideLoading()

  if (!res || !res?.success || !Array.isArray(res.data)) {
    tableData.value = []
    total.value = 0
    return
  }

  tableData.value = await buildTableData(res?.data)
  total.value = res?.metaData?.total
}

/**
 * 含节流操作的请求表格组件的方法
 * @returns {Promise<void>}
 */
const loadTableData = async () => {
  if (timerId) {
    clearTimeout(timerId)
  }

  timerId = setTimeout(async () => {
    await fetchTableData()
    timerId = null
  }, 300)
}

/**
 * 初始化项目数据
 */
const initData = () => {
  currentPage.value = 1
  pageSize.value = 50
  nextTick(async () => {
    await loadTableData()
  })
}

/**
 * 操作内容的点击
 * 但是这里是组件，只做触发，不做业务处理
 */
const operationHandler = ({btnConfig, rowData}) => {
  emit('operate', {btnConfig, rowData})
}

/**
 * 更改一页显示多少条数据的回调函数
 */
const onPageSizesChange = async (value) => {
  pageSize.value = value
  await loadTableData()
}

const onCurrentPageChange = async (value) => {
  currentPage.value = value
  await loadTableData()
}

const showLoading = () => {
  loading.value = true
}

const hideLoading = () => {
  loading.value = false
}


//向上暴露方法、数据
defineExpose({
    showLoading,
    hideLoading,
    initData,
    loadTableData
  }
)

</script>

<style scoped lang="less">
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .table {
    flex: 1
  }

  .pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>