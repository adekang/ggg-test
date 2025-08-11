import input from "./complex-view/input/input.vue";
import select from "./complex-view/select/select.vue";
import dynamicSelect from "./complex-view/dynamic-select/dynamic-select.vue";
import dayRange from "./complex-view/day-range/day-range.vue";

// 业务拓展BusinessSearchItemConfig配置
import BusinessSearchItemConfig from './search-item-config'

/**
 * 主要用于根据type实现不同类型的动态组件
 */
const searchItemConfig = {
  //输入框
  input: {
    component: input
  },
  //下拉选择框
  select: {
    component: select
  },
  //动态请求的选择框
  dynamicSelect: {
    component: dynamicSelect
  },
  //日期功能
  dayRange: {
    component: dayRange
  }
}

export default {
  ...searchItemConfig,
  ...BusinessSearchItemConfig
}