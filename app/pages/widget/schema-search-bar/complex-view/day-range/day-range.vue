<template>
  <!-- v-model双向绑定数据 -->
  <!-- v-bind：透传属性-->
  <el-date-picker
      v-model="dtoValue"
      v-bind="schema?.option"
      type="daterange"
      range-separator="至"
      :start-placeholder="`${schema?.label}（开始）`"
      :end-placeholder="`${schema?.label}（结束）`"
      class="date-range"
  ></el-date-picker>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {first, last} from "lodash";
import moment from "moment";

const {schemaKey, schema} = defineProps({
  schemaKey: String,
  schema: Object
})

const emit = defineEmits(['loaded'])

const dtoValue = ref([])

const getValue = () => {
  return dtoValue?.value?.length === 2 ? {
    [`${schemaKey}_start`]: moment(first(dtoValue.value)).format('YYYY-MM-DD'),
    [`${schemaKey}_end`]: moment(last(dtoValue.value)).format('YYYY-MM-DD')
  } : {}
}

const reset = () => {
  dtoValue.value = []
}

onMounted(() => {
  reset()
  emit('loaded')
})

defineExpose({
  getValue,
  reset,
})
</script>


<style scoped lang="less">

</style>