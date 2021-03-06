import { sysConfig as config } from "./config"
import lodash from 'lodash'

export var getSettings = (type)=>{
  let settings = JSON.parse(localStorage.getItem(`${config.nameSpace}-setting`))

  switch (type) {
    case 'sys':
      if(settings && settings.sys) return settings.sys
      break;
  
    default:
      if(settings && settings.user) return settings.user
      break;
  }


}

export function setSettings(value,type='user'){
  let data = {}
  data[type] = value
  localStorage.setItem(`${config.nameSpace}-setting`,JSON.stringify(data))

}

/**
 * 创建弹框遮罩
 * @param {*} obj 对象句柄
 * @param {*} type 弹框样式： black 半透明遮罩；default 透明遮罩
 * @returns 
 */
export function createOverlay(obj=this,type){
  let className = ''
  if(type == 'black'){
    className = 'lz-overlay-black'
  }else{
    className = 'lz-overlay'
  }
  let overlay = document.querySelector(`.${className}`)
    if(overlay){
      obj.overlay = overlay
    }else{
      obj.overlay = document.createElement('div')
      obj.overlay.className = className
    }
    return obj.overlay
}

/**
 * 生成数字与字母的随机组合
 * @param {*} len 组合长度
 * @returns 
 */
export function randomString(len) {
  const charSet = 'abcdefghijklmnopqrstuvwxyz0123456789cdd13099';
  return lodash.sampleSize(charSet,len).toString().replace(/,/g, '');
}


/**
 * 通过触发 protyle input 事件来保存 block 内容，需要确保 protyle 获得焦点
 */
export function saveViaTransaction(){
  let protyle = document.querySelector('.fn__flex-1.protyle:not(.fn__none) .protyle-wysiwyg.protyle-wysiwyg--attr') //需要获取到当前正在编辑的 protyle
  let e = document.createEvent('HTMLEvents')
  e.initEvent('input',true,false)
  protyle.dispatchEvent(e)
}

/**
 * 消息提示 toast 
 * @param text 提示文案
 * @param type 样式，取值：info / success / danger / warning
 **/ 
export function snackbar(text,type='info'){
  let snackbar = document.querySelector('#snackbar')
  if(!snackbar){
    snackbar = document.createElement('div')
    snackbar.id = 'snackbar'
    document.body.appendChild(snackbar)
  }
  snackbar.classList.add('show',type)
  snackbar.innerText = text
  setTimeout(function(){ snackbar.classList.remove("show", type); }, 3000);
}

/**
 * 计算弹出框的坐标位置，使得 box 不会超出页面范围
 * @param box 元素 node
 * @param x 事件 Event x 坐标
 * @param y 事件 Event y 坐标
 * @param offsetX x 偏移量
 * @param offsetY y 偏移量
 * @param offsetPostion 设置 box 相对于点击坐标的位置
 */
export function computeBoxPosition(box,x,y,offsetX = 10,offsetY = 20, offsetPostion = 'center'){
  let boxWidth  = box.clientWidth,
      boxHeight = box.clientHeight,
      docWidth  = document.body.clientWidth,
      docHeight = document.body.clientHeight,
      top  = y + offsetY,
      left = 0

      switch (offsetPostion) {
        case 'left':
          left = x - boxWidth - offsetX
          break
        case 'right':
          left = x + offsetX
          break
        default:
          left = x - boxWidth / 2 - offsetX
          break
      }

      // box右侧超出页面
      if(left + boxWidth > docWidth)     left = docWidth - boxWidth - offsetX
      // box下侧抽出页面
      if(top + boxHeight > docHeight)    top  = docHeight - boxHeight - offsetY
      // box遮挡了点击位置
      if(y > top && y < top + boxHeight) top  = y - boxHeight - offsetY
      top  = top  < 0 ? offsetY : top
      left = left < 0 ? offsetX : left
      return {x:left, y:top}
}