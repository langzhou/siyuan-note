import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import {install} from '@icon-park/vue-next/es/all'
import '@icon-park/vue-next/styles/index.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

const app = createApp(App)
app.use(ContextMenu)
installElementPlus(app)
install(app)
app.mount('#app')