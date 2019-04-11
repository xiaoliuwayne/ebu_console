import axios from 'axios'
import router from '@/router'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
// import { getUserId } from '@/utils/auth'
import Qs from 'qs'

// 创建axios实例
const service = axios.create({
  // #config里面有这个transformRquest，这个选项会在发送参数前进行处理。
  // #这时候我们通过Qs.stringify转换为表单查询参数
  transformRequest: [function(data) {
    data = Qs.stringify(data)
    return data
  }],
  // #设置Content-Type
  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  params: {
    appName: process.env.APP_NAME
  },
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getUserId() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  if (config.url.indexOf('api/') === -1) {
    config.url = process.env.OPEN_API + config.url
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.exDesc) {
      if (res.exId === -33 && router.app.$route.path !== '/login') {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        });
      } else {
        Message({
          message: res.exDesc,
          type: 'error',
          duration: 5 * 1000
        });
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
