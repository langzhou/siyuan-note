/* import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'

createApp(App).use(ElementPlus).mount('#app') */


import { createApp } from 'vue'
import store from '../../store'
import App from './App.vue'
const app = createApp(App)
app.use(store)
app.mount('#app')