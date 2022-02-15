var now = new Date(); // 当前日期
var nowDayOfWeek = now.getDay(); // 今天本周的第几天
var nowDay = now.getDate(); // 当前日
var nowMonth = now.getMonth(); // 当前月
var nowYear = now.getYear(); // 当前年
nowYear += (nowYear < 2000) ? 1900 : 0;

var DateUtil = {
  // 字符串转换成时间戳
  strToTimeStamp(text){
    // 20210624110104
    let year    =  text.slice(0,4)
    let month   =  text.slice(4,6)
    let day     =  text.slice(6,8)
    let hour    =  text.slice(8,10)
    let minutes =  text.slice(10,12)
    let second  =  text.slice(12,14)
    let stringDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second
    let result = new Date(stringDate).getTime()
    return result
  },


  /**
     * 获得当前日期
     *
     * @returns
     */
   getNowDay(convert='string') {
    if(convert=='string'){
        return this.formatDate(new Date());
    }else{
        return new Date()
    }
    
},

/** 
 *  获得明天日期 */
getTomorrowDay(convert='string'){
    let date = new Date(now.getFullYear(),nowMonth,nowDay + 1)
    if(convert == 'string'){
        return this.formatDate(date);
    }else{
        return date
    }
},

/** 
 *  获得后天日期 */
 getAfterTomorrowDay(convert='string'){
  let date = new Date(now.getFullYear(),nowMonth,nowDay + 2)
  if(convert == 'string'){
      return this.formatDate(date);
  }else{
      return date
  }
},
/**
 * 获得本周的开始时间
 *
 * @returns
 */
getStartDayOfWeek(convert='string') {
    var day = nowDayOfWeek || 7;
    let date = new Date(now.getFullYear(), nowMonth, nowDay + 1 - day)
    if(convert == 'string'){
        return this.formatDate(date);
    }else{
        return date
    }
    
},
/**
 * 获得本周的结束时间
 *
 * @returns
 */
getEndDayOfWeek(convert='string') {
    var day = nowDayOfWeek || 7;
    let date = new Date(now.getFullYear(), nowMonth, nowDay + 7 - day)
    if(convert == 'string'){
        return this.formatDate(date);
    }else{
        return date
    }
},
/**
 * 获得本月的开始时间
 *
 * @returns
 */
getStartDayOfMonth(convert='string') {
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    if(convert == 'string'){
        return this.formatDate(monthStartDate);
    }else{
        return monthStartDate
    }
},
/**
 * 获得本月的结束时间
 *
 * @returns
 */
getEndDayOfMonth(convert='string') {
    var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays());
    if(convert == 'string'){
        return this.formatDate(monthEndDate);
    }else{
        return monthEndDate
    }
},
/**
 * 获得本月天数
 *
 * @returns
 */
getMonthDays() {
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    var monthEndDate = new Date(nowYear, nowMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
},
/**
 * @param 日期格式化
 * @returns {String}
 */
formatDate(date,format=0) {
  if(typeof date != 'object' ){
    date = new Date(date * 1)
  }
  let year    = date.getFullYear()
  let month   = date.getMonth() + 1
  let day     = date.getDate()
  let hour    = date.getHours()
  let minutes = date.getMinutes()
  let seconds  = date.getSeconds()
  let formatMonth     = ('0' + month).slice(-2)
  let formatDay       = ('0' + day).slice(-2)
  let formatHour      = ('0' + hour).slice(-2)
  let formatMinutes   = ('0' + minutes).slice(-2)
  let formatSeconds    = ('0' + seconds).slice(-2)
  let result

  switch(format){
    // 2021-06-07
    case 0:
      result = year + '-' + formatMonth + '-' + formatDay
      break
    // 2021-06-07 12:12:01
    case 1:
      result = year + '-' + formatMonth + '-' + formatDay + ' ' + formatHour + ':' + formatMinutes + ':' + formatSeconds
      break
    // 2021/06/07 12:12:01
    case 2:
      result = year + '/' + formatMonth + '/' + formatDay + ' ' + formatHour + ':' + formatMinutes + ':' + formatSeconds
      break
    // 2021/06/07
    case 3:
      result = year + '/' + formatMonth + '/' + formatDay
      break
    // 6月7日 
    case 4:
        if(year < nowYear){
          result = year + '年' + month + '月' + day + '日'
        }else{
          result = month + '月' + day + '日'
        }
        break
    default:
      result = year + '年' + month + '月' + day + '日'
      break 
    }

    return result
    
}

}


export default{
  DateUtil
}