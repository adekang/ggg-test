const { describe, it, beforeAll } = require('@jest/globals')
const supertest = require('supertest')
const md5 = require('md5')
const elpisCore = require('../../elpis-core')

const sigbKey = 'adekang'
const st = Date.now()

describe('测试 project 相关接口', () => {
  let modelList
  const projectList = []

  let request

  jest.setTimeout(60000)

  beforeAll(async () => {
    const app = await elpisCore.start()
    modelList = require('../../model/index.js')(app)
    projectList.push(...modelList.flatMap((m) => Object.values(m.project)))
    request = supertest(app.listen())
  })

  // 提取公共请求配置
  const getSignature = () => ({
    s_sign: md5(`${sigbKey}_${st}`),
    s_t: st
  })


  it('GET /api/project/model_list', async () => {
    const res = await request.get('/api/project/model_list').set(getSignature())
    expect(res.body.success).toBe(true)

    const resData = res.body.data
    expect(resData.length).toBeGreaterThan(0)

    resData.forEach((item) => {
      expect(item.model).toBeDefined()
      expect(item.model.key).toBeTruthy()
      expect(item.model.name).toBeTruthy()
      expect(item.project).toBeDefined()
      Object.values(item.project).forEach((project) => {
        expect(project.key).toBeTruthy()
        expect(project.name).toBeTruthy()
      })
    })
  })

  it('GET /api/project', async () => {
    // 不存在的
    const res = await request.get('/api/project?proj_key=taobao').set(getSignature())
    expect(res.body.success).toBe(true)
  })
})
