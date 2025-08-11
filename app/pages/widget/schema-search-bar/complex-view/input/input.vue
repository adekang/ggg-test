<template>
  <!-- v-model双向绑定数据 -->
  <!-- v-bind：透传属性-->
  <el-input
    v-model="dtoValue"
    v-bind="schema.option"
    class="input"
  />
</template>

<script setup>

import { onMounted, ref } from "vue";

const {schemaKey, schema} = defineProps({
  schemaKey: String,
  schema: Object
})

const emit = defineEmits(['loaded'])

const dtoValue = ref()

const getValue = () => {
  // 检查值是否为空（undefined、null、空字符串）
  const isEmpty = dtoValue.value === undefined ||
                 dtoValue.value === null ||
                 dtoValue.value === '';

  return !isEmpty ? {
    [schemaKey]: dtoValue.value
  } : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.default
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