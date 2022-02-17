import config    from '../components/config'
import toolbar   from '../components/toolbar'
import dragCover from '../components/dragCover'
import attrsMenu from '../components/attrsMenu'
class SiyuanUtils{

  constructor(){
    chrome.storage.local.get(['setting'], async (result)=> {
      let userSetting = result.setting && JSON.stringify(result.setting.user) != '{}' ? result.setting.user : false
      let baseUrl     = userSetting && result.setting.user.baseUrl.replace(/\s/g,'') || config.baseUrl
      this.setting    = {config:config, user:userSetting, baseUrl:'http://' + baseUrl}
      this.load()
    });

  }

  /* 开启所需模块 */
  load(){
    this.addFontface()
    this.addCustomCSS()
    this.domWatcher()
    new toolbar(this.setting)
    this.dragCover = new dragCover(this.setting)
    if(this.setting.user.quickAttrs){
      this.initAttrsMenu()
    }
    
  }

  initAttrsMenu(){
    let layout = document.querySelector('.layout__center.fn__flex.fn__flex-1')
    if(layout){
      new attrsMenu(layout,this.setting)
    }else{
      setTimeout(()=>{
        this.initAttrsMenu()
      },500)
    }
 
  }

  /* 处理观察对象节点变动事件 */
  childListChangedHook(mutation){
    // 观察编辑器protyle变动
    if(mutation.addedNodes){
      
      let node = mutation.addedNodes.item(0)
      // 匹配找出新增的 protyle 编辑器
      if(node && node.className == 'fn__flex-1' ){
        // 因为 dom 树可能没有完全加载，需要延迟处理
        setTimeout(()=>{this.dragCover.creatBtn(node)},1000)
      }
     
    }
  }



  domWatcher(){
    var targetNode = document.querySelector('.layout__center.fn__flex.fn__flex-1'); 
    if(!targetNode){
      setTimeout(() => { this.domWatcher() }, 300);
    }else{
      const config = { attributes: false, childList: true, subtree: true };
      let self = this
      const callback = function(mutationsList, observer) {
          for(let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                self.childListChangedHook(mutation)
              }
              else if (mutation.type === 'attributes') {
                  console.log('The ' + mutation.attributeName + ' attribute was modified.');
              }
          }
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
      // observer.disconnect();
    }
  }
  

  /* 添加自定义 css */
  addCustomCSS() {
    // 将自定义 css 放置在 protyleRevealStyle 之前，官方主题之后
    let dom = document.querySelector('#protyleRevealStyle')
    if(dom){
      let customCss       = document.createElement('style')
      customCss.innerText = this.setting.user.customCss
      customCss.id = 'custom-css'
      document.head.insertBefore(customCss,dom)
    }else{
      setTimeout(()=>{this.addCustomCSS() },300)
    }
  }

  /** 
   * 增加 element 字体
   */
  addFontface() {
    let ttf  = chrome.runtime.getURL('element-icons.ttf')
    let woff = chrome.runtime.getURL('element-icons.woff')
    let css  = `@font-face{font-family:element-icons;src:url(${woff}) format("woff"),url(${ttf}) format("truetype");font-weight:400;font-display:"auto";font-style:normal}`
    let fontface = document.createElement('style')
    fontface.innerText = css
    document.head.appendChild(fontface)
  }

  

  /* 给后台发送消息 
  * @msg：消息内容
  * @fn：回调函数
  */
 sendMsg() {
  let msg = 'hello,bakcground'
  chrome.runtime.sendMessage({msg: msg}, function(response) {
    console.log(response)
  })  
}


}


window.onload = ()=>{ new SiyuanUtils() }


