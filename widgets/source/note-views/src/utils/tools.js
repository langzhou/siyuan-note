import { getConfigs } from "./config"

export function log(error,color='none'){
    if(color == 'none'){
        console.log(error)
    }else{
        console.log("%c"+error,"color:"+color)
    }
    
}

/* 处理原始数据，包括获取封面，获取更友好的日期
* note：文章数据
* dateType:采用哪种友好日期格式
*/
export function parseRaw(note,dateType){
    dateType = arguments[1] ? arguments[1] : 1
    for(let i=0; i< note.length; i++){
        //处理封面
        let ial = note[i].ial
        let reg = /background-image:url\(assets\/(.*)\);{1}?/
        let img = ial.match(reg)
        if(img){
            let domain = "http://127.0.0.1:6806/assets/"
            note[i].cover = "background-image:url('" + domain + img[1] + "');"
        }else{
            let reg = /background-image:(.*?)["|;]/
            let img = ial.match(reg)
            if(img){
            note[i].cover = "background-image:" + img[1]
            }else{
            note[i].cover = null
            }
        }

        //处理日期
        let created = note[i].created
        let updated = note[i].updated
        note[i].new_created = convertDate(created,dateType)
        note[i].new_updated = convertDate(updated,dateType)

    }
    return note
}


// 官方原始日期转换成年-月-日格式
export function convertDate(date,type){

    type = arguments[1] ? arguments[1] : 0
    let year    =  date.slice(0,4)
    let month   =  date.slice(4,6)
    let day     =  date.slice(6,8)

    let tempDate = new Date()
    let thatYear = parseInt(year)
    let thisYear = tempDate.getFullYear() 
    thisYear = parseInt(thisYear)
    let newDate =  ""

    // 返回多种日期格式：默认 年-月-日；1：XX年XX月XX日；2：在（1）的基础上，如果是当年则不显示年份
    switch(type){
        case 1:
            if(thatYear < thisYear){
                newDate = year + " 年 " + parseInt(month) + " 月 " + parseInt(day) + " 日"
            }else{
                newDate = parseInt(month) + " 月 " + parseInt(day) + " 日"
            }
        break;
        case 2:
            newDate = year + " 年 " + parseInt(month) + " 月 " + parseInt(day) + " 日"
        break;
        case 3:
            newDate = year + "/" + month + "/" + day
        break;
        default:
            newDate = year + "-" + month + "-" + day
    }
    return newDate   
}

// 获取 get 参数
export function getUrlParam(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// 判断优先级、待办类型返回不同标签样式
export function getTagStyle(value,tagType='element'){
    let configs = getConfigs()
    let userConfig = configs.user
    const defautConfig = {"danger":[""],"warning":[""],"success":[""],"primary":[""]} //设置默认值，避免用户配置获取失败时无法继续执行程序
    userConfig = userConfig ? userConfig : defautConfig

    let style,danger,warning,success,primary
    let prefix_style     = 'background-color:'
    let danger_list      = ['P0','P1'].concat(userConfig.danger)//红色
    let warning_list     = ['P2','doing'].concat(userConfig.warning) //黄色
    let success_list     = ['P3','done'].concat(userConfig.success) //绿色
    let primary_list     = ['someday'].concat(userConfig.primary) //主题色

    if(tagType == 'element'){
        //饿了么标签组件 el-tag
        style    =   'info' //设置默认样式
        danger   =   'danger'
        warning  =   'warning'
        success  =   'success'
        primary  =   'primary'
    }else{
        style    =   prefix_style + '#666666;' //设置默认颜色
        danger   =   prefix_style + '#f56c6c;'
        warning  =   prefix_style + '#e6a23c;'
        success  =   prefix_style + '#67c23a;'
        primary  =   prefix_style + '#409eff;'
    }

    if(danger_list.includes(value)) { style = danger}
    if(warning_list.includes(value)){ style = warning }
    if(success_list.includes(value)){ style = success }
    if(primary_list.includes(value)){ style = primary }

    return style
   
     
}