import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import axios from 'axios'

window.onload = initApp()

async function initApp(){

    // 获取用户配置信息
    let userConfig
    await axios.get('./config.json').then((result) => {
        userConfig = result.data
    }).catch((error) => {
        alert('获取用户配置文件出错，可能会导致部分功能不可用')
        console.log('%c获取配置文件出错:' + error,'color:red')
    })

    const app = createApp(App)
    installElementPlus(app)
    localStorage.setItem('config',JSON.stringify(userConfig)); //存储用户配置文件
    app.mount('#app')
}






