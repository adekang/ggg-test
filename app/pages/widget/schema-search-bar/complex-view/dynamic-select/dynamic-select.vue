<template>
  <el-select
    v-model="dtoValue"
    v-bind="schema.option"
    class="dynamic-select"
  >
    <el-option
      v-for="item in enumList"
      :key="item?.value"
      :label="item?.label"
      :value="item?.value"
    />
  </el-select>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {first} from "lodash";
import $curl from '$elpisCommon/curl';

const {schemaKey, schema} = defineProps({
  schemaKey: String,
  schema: Object
})

const emit = defineEmits(['loaded'])

const dtoValue = ref()
const enumList = ref([])

const getValue = () => {
  return dtoValue.value !== undefined ? {
    [schemaKey]: dtoValue.value
  } : {}
}

const reset = () => {
  dtoValue.value = schema?.option?.default ?? first(enumList.value)?.value
}

const fetchEnumList = async () => {
  const result = await $curl({
    method: "get",
    url: schema?.option.api,
    data: {}
  })

  if (result?.data?.length) {
    enumList.value.push(...result?.data)
  }
}


onMounted(async () => {
  await fetchEnumList()
  reset()//因为要设置默认值，有可能是第一个
  emit('loaded')
})

defineExpose({
  getValue,
  reset,
})
</script>


<style scoped lang="less">

</style>