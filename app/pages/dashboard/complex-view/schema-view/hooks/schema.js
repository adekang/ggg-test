import {useMenuStore} from '$store/menu';
import {cloneDeep} from "lodash";
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute} from 'vue-router';

export function useSchema() {
  const route = useRoute();
  const menuStore = useMenuStore()

  const api = ref('')
  const searchSchema = ref({})
  const tableSchema = ref({})
  const searchConfig = ref()
  const tableConfig = ref()

  const components = ref({})

  /**
   * 构造schemaConfig 相关配置，输送给 schemaView 解释
   */
  const buildData = function () {
    const {key, sider_key: siderKey} = route.query
    const mItem = menuStore.findMenuItem({
      key: 'key',
      value: siderKey ?? key
    })

		if (mItem && mItem.schemaConfig) {
      //获取当前的schema配置
      const {schemaConfig} = mItem

      //不要污染原来的schema配置
      const _schema = cloneDeep(schemaConfig.schema)

      api.value = schemaConfig?.api ?? ''

      tableSchema.value = {}
      tableConfig.value = undefined
      searchSchema.value = {}
      searchConfig.value = undefined
      components.value = {}

      nextTick(() => {
        //构造searchSchema 以及 tableConfig
        tableSchema.value = buildDtoSchema(_schema, 'table')
        tableConfig.value = _schema?.tableConfig

        //构造searchSchema 以及 searchConfig
        const dtoSearchSchema = buildDtoSchema(_schema, 'search')
        for (const key in dtoSearchSchema.properties) {
          if (route.query[key] !== undefined) {
            dtoSearchSchema.properties[key].option.default = route.query[key]//路由中可能会带上某个列的搜索的默认值
          }
        }
        searchSchema.value = dtoSearchSchema
        searchConfig.value = _schema.searchConfig

        //构造 components，期望：components:{ componentKey: { schema , config } }
        const {componentConfig} = _schema
        if (componentConfig && Object.keys(componentConfig).length > 0) {
          const dtoComponents = {}

          for (const componentName in componentConfig) {
            dtoComponents[componentName] = {
              schema: buildDtoSchema(_schema, componentName),
              config: componentConfig[componentName]
            }
          }

          components.value = dtoComponents
        }
      })
    }
  }

  /**
   * 通用重新构建schema的方法,提取有效的schema信息（提纯、清除噪音）
   * 把properties的那些字段的xxxOption 提纯为 option ，然后返回给调用者 以便赋值给xxxSchema
   * @param schema
   * @param comName 配置信息，例如tableOption、formOption
   */
  const buildDtoSchema = function (schema, comName) {
    if (!schema?.properties) return {}
    const dtoSchema = {
      type: 'object',
      properties: {}
    }

    for (const key in schema.properties) {
      const props = schema.properties[key]
      //如果当前schema中包含了目标Option时，直接放进dto中
      if (props[`${comName}Option`]) {
        let dtoProps = {}
        //提取非option的部分到dto中，进行数据的提纯
        for (const pKey in props) {
          if (!pKey.includes('Option')) {
            dtoProps[pKey] = props[pKey]
          }
        }
        //处理 comName Option
        dtoProps = Object.assign({}, dtoProps, {option: props[`${comName}Option`]})
        //处理 required 字段
        const {required} = schema
        if (required && !!required?.length && required?.find(item => item === key)) {
          dtoProps.option.required = true
        }

        dtoSchema.properties[key] = dtoProps
      }
    }

    return dtoSchema
  }

  watch([
    () => route.query.key,
    () => route.query.sider_key,
    () => menuStore.menuList
  ], () => {
    if (route.query.key) {
      buildData()
    }
  }, {
    deep: true,
    immediate: false
  })

  onMounted(() => {
    if (route.query.key) {
      buildData()
    }
  })

  return {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
    components,
  }
}