import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// create an axios instance
const service = axios.create({
  baseURL: baseConfig['main_api'], // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const params = config.params || {}
    config.headers['Content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

    config.params = {
      ...params,
      token: store.getters.token || ''
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      return Promise.resolve(res)
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg || error.message || 'ERROR~',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
