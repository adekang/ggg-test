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
        :schema="components[name]?.schema"
        ref="schemaFormRef"
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
import $curl from '$elpisCommon/curl'
import {ElNotification} from "element-plus";

const {api, components} = inject('schemaViewData')

const emit = defineEmits(['command'])

const name = ref('createForm')//作用在于使外部可以通过此名字在componentConfig中找到该组件
const isShow = ref(false)
const title = ref('')
const saveBtnText = ref('')
const schemaFormRef = ref(null)
const loading = ref(false)

const onSave = async () => {
  if (loading.value) return
  loading.value = true
  //1、校验表单
  if (!schemaFormRef?.value?.validate()) {
    loading.value = false
    return
  }
  
  //2、请求
  const res = await $curl({
    method: 'post',
    url: api.value,
    data: {
      ...schemaFormRef?.value?.getValue()
    }
  })
  
  loading.value = false
  
  if (!res || !res?.success) return ElNotification.error(res?.message)
  
  ElNotification({
    title: '创建成功',
    message: '创建成功',
    type: 'success'
  })
  
  emit('command', {
    event: 'loadTableData'
  })
  
  close()
}

/**
 * 关闭抽屉
 */
const close = () => {
  isShow.value = false
}

/**
 * 调起方法展示当前组件
 * @param rowData
 */
const show = (rowData) => {
  const {config} = components.value?.[name.value]
  
  title.value = config?.title
  saveBtnText.value = config?.saveBtnText
  
  isShow.value = true
}

defineExpose({
  name,
  show
})
</script>

<style scoped lang="less">

</style>