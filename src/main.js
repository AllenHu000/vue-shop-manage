import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/styles/global.less'

// 请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
