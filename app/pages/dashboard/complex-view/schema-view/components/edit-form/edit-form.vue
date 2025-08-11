<template>
  <el-drawer
    v-model="isShow"
    direction="rtl"
    :destroy-on-close="true"
    :size="500"
  >
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    
    <template #default>
      <schema-form
        v-loading="loading"
        ref="schemaFormRef"
        :schema="components[name]?.schema"
        :model="dtoValue"
      >
      </schema-form>
    </template>
    
    <template #footer>
      <el-button type="primary" @click="onSave">{{ saveBtnText }}</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import {inject, ref} from "vue";
import SchemaForm from "$elpisWidgets/schema-form/schema-form.vue";
import $curl from '$elpisCommon/curl';
import {ElNotification} from "element-plus";

/**
 * 1、根据mainKey，从rowData中获取到对应的mainValue
 * 2、根据mainKey=mainValue去请求接口，把数据放到dtoValue中
 * 3、根据dtoValue的数据放到dtoForm中进行回显给用户编辑
 */

const {api, components} = inject('schemaViewData')
const emit = defineEmits(['command'])
const title = ref('')
const name = ref('editForm')
const isShow = ref(false)
const saveBtnText = ref('')
const loading = ref(false)
const mainKey = ref('')
const mainValue = ref()
const dtoValue = ref({})
const schemaFormRef = ref(null)

const show = (rowData) => {
  const {config} = components.value?.[name.value]
  //设置编辑表单的标题与按钮
  title.value = config?.title
  saveBtnText.value = config?.saveBtnText
  //提取编辑表单的mainKey，以及找到对应的值 以便请求接口
  mainKey.value = config?.mainKey
  mainValue.value = rowData[config?.mainKey]
  //重置数据
  dtoValue.value = {}
  
  isShow.value = true
  
  fetchFormData()
}

const close = () => {
  isShow.value = false
}

const fetchFormData = async () => {
  if (loading.value) return
  loading.value = true
  const res = await $curl({
    method: 'get',
    url: api.value,
    query: {
      [mainKey.value]: mainValue.value
    }
  })
  loading.value = false
  if (!res || !res?.success || !res?.data) return
  dtoValue.value = res?.data
}

const onSave = async () => {
  if (loading.value) return
  if (!schemaFormRef?.value?.validate()) return
  
  loading.value = true
  
  const res = await $curl({
    method: 'put',
    url: api.value,
    data: {
      [mainKey.value]: mainValue.value,
      ...schemaFormRef.value?.getValue()
    }
  })
  loading.value = false
  if (!res || !res?.success) return
  
  ElNotification({
    title: '修改成功',
    message: '修改成功',
    type: 'success'
  })
  
  close()
  
  emit('command', {
    event: 'loadTableData'
  })
}

defineExpose({
  name,
  show
})
</script>

<style scoped lang="less">

</style>