
export var systemConfigs={

    IS_TEST:  false,
    TEST_URL: 'http://127.0.0.1:6806',
    PROD_URL: 'http://127.0.0.1:6806',

    priorityHigh:['P0'],
    priorityMedium:[],
    priorityLow:[],

    todoInbox:[],
    todoDoing:[],
    todoDone:[],
    todoSomeday:[],

    
    // 菜单选项
    viewTypeOptions: [{
        value: 'CardView',
        label: '卡片视图'
      },{
        value: 'ListView',
        label: '列表视图'
      },{
        value: 'TableView',
        label: '表格视图'
      }, {
        value: 'CalendarView',
        label: '日历视图'
      },{
        value: 'KanbanView',
        label: '看板视图'
      }],
    orderFieldOptions: [{
        value: 'created',
        label: '创建日期'
      }, {
        value: 'updated',
        label: '更新日期'
      }],
    orderTypeOptions: [{
        value: 'ASC',
        label: '升序'
      }, {
        value: 'DESC',
        label: '降序'
      }],
    pageSizeOptions: [{
        value: 6,
        label: '分页：6'
      }, {
        value: 10,
        label: '分页：10'
      }, {
        value: 20,
        label: '分页：20'
      }],

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