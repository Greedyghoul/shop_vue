import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局css样式
import './assets/css/global.css'

// 引入图标css样式
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 引入element-ui
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// 配置axios
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// 设置拦截器，给axios装配token信息
axios.interceptors.request.use(
  function(config) {
    // config对象是axios的子级成员，可以直接作用于axios
    // 获取token
    const token = window.sessionStorage.getItem('token')
    // 给axios的请求头中设置token信息，名称为Authorization
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
