
export var systemConfigs={

    IS_TEST:  false,
    TEST_URL: 'http://127.0.0.1:6806',
    PROD_URL: 'http://127.0.0.1:6806',

    database:   'mydb5.3',
    table_name: 'todo',

}
// 获取系统和用户配置
export function getConfigs(){
    let userConfig = getUerConfig()
    let configs = {system: systemConfigs,user:userConfig}
    return configs
}

// 读取并解析用户配置信息
export function getUerConfig(){
  try {
    return JSON.parse(localStorage.getItem('config'))
  } catch (error) {
    console.log('%c解析用户配置文件出错：', 'color:red')
    console.log(error)
    return false
  }
  
}