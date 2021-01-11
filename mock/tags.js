import Mock from 'mockjs'

const NameList = []
const count = 30

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    id: '@increment',
    tname: '@cname',
    'kejian|0-1': 1,
    'xuhao|1-100': 100
  }))
}
NameList.push({ name: 'mock-Pan' })

export default [
  // username search
  {
    url: '/admin/tabsearch',
    type: 'post',
    response: config => {
      return {
        code: 200,
        data: NameList
      }
    }
  }
]
