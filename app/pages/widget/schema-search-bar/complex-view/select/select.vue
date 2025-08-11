<template>
  <el-select
    v-model="dtoValue"
    v-bind="schema.option"
    class="select"
  >
    <el-option
      v-for="item in schema.option?.enumList"
      :key="item?.value"
      :label="item?.label"
      :value="item?.value"
    />
  </el-select>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {first} from "lodash";

const {schemaKey, schema} = defineProps({
  schemaKey: String,
  schema: Object
})

const emit = defineEmits(['loaded'])

const dtoValue = ref()

const getValue = () => {
  return dtoValue.value !== undefined ? {
    [schemaKey]: dtoValue.value
  } : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.default ?? first(schema?.option?.enumList)?.value
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