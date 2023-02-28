import { createApp } from 'vue'
import App from '@/App.vue'
// --------------------------------------
import 'element-plus/dist/index.css'

import "@/style/reset.scss"; //重置样式表
import '@/style/index.scss' //自定义样式表

// import 'default-passive-events' // 解决警告： [Violation] Added non-passive event listener to a scroll-blocking ＜some＞ event. Consider marking eve
// import 'element-plus/es/components/message/style/css'
import ElementPlus from 'element-plus'

import router from '@/router/'
import { store } from '@/store/'
import { Request } from '@/util/request'
import VueAxios from 'vue-axios'

import 'virtual:svg-icons-register' //svg-icon组件

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// --------------------------------------

import SocketIO from './util/socket'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$socket = SocketIO

app.use(ElementPlus)
// --------------------------------------

app.use(router)
app.use(store)

app.config.globalProperties.$axios = Request
app.use(VueAxios, Request.init())
// --------------------------------------

app.mount('#app')
