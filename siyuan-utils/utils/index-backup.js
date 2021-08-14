import config  from "./config.js"
import toolbar from "./toolbar.js"
import attrsMenu from "./attrsMenu.js"
import contextMenu from "./contextMenu.js"


class SiyuanUtils{
  constructor(){
    this.init()
  }

  init(){

    this.setting = config

    new toolbar(this.setting)


    let layout = document.querySelector('.layout__center.fn__flex.fn__flex-1')
      if(layout){
        new attrsMenu(layout,this.setting)
      
      }else{
        setTimeout(()=>{
          this.initAttrsMenu()
        },500)
      }
  

      this.addFontface()
      this.appendElements()
      this.domWatcher()
      setTimeout(()=>{
        this.resizeIframe()
        window.onresize = this.resizeIframe
      },1000)
      
    // console.log('window onload')
  
    }
   
  /* 处理观察对象节点变动事件 */
  childListChangedHook(mutation){
    // 观察编辑器protyle变动
    if(mutation.addedNodes){
      
      let node = mutation.addedNodes.item(0)
      // 匹配找出新增的 protyle 编辑器
      if(node && node.className == 'fn__flex-1' ){
        // 因为 dom 树可能没有完全加载，需要延迟处理
        console.log('change');
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
  
  resizeIframe(){
    console.log('resize..');
    let iframe = document.querySelector('iframe')
    if(iframe){
      // console.log(iframe.frameElement.parentElement.parentElement.getAttribute('data-node-id'))
        setTimeout(()=>{
          iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 10 + 'px'
          console.log(iframe.style.height)
          iframe.style.width = iframe.parentNode.parentNode.scrollWidth + 'px'
        },1000)
      
    }
  }
  
  
  appendElements(){
    let fragment = document.createDocumentFragment()
  
    let elementCss = document.createElement('link')
    elementCss.setAttribute('rel','stylesheet')
    elementCss.setAttribute('type','text/css')
    elementCss.setAttribute('href','./widgets/siyuan-utils/css/element.css')
    fragment.appendChild(elementCss)
  
    let css = document.createElement('link')
    css.setAttribute('rel','stylesheet')
    css.setAttribute('type','text/css')
    css.setAttribute('href','./widgets/siyuan-utils/css/siyuan-utils.css')
    fragment.appendChild(css)
  
   /*  let lodash = document.createElement('script')
    lodash.setAttribute('src','./widgets/siyuan-utils/js/lodash.min.js')
    fragment.appendChild(lodash)
  
    let dayjs = document.createElement('script')
    dayjs.setAttribute('src','./widgets/siyuan-utils/js/dayjs.min.js')
    fragment.appendChild(dayjs) */
    
    document.head.appendChild(fragment)
  }

  /** 
   * 增加 element 字体
   */
   addFontface() {
      let ttf  = './widgets/siyuan-utils/assets/element-icons.ttf'
      let woff = './widgets/siyuan-utils/assets/element-icons.woff'
      let css  = `@font-face{font-family:element-icons;src:url(${woff}) format("woff"),url(${ttf}) format("truetype");font-weight:400;font-display:"auto";font-style:normal}`
      let fontface = document.createElement('style')
      fontface.innerText = css
      document.head.appendChild(fontface)
    }
  
  // localStorage.setItem('lz-setting',JSON.stringify(data))
  // let res = localStorage.getItem('local-searches')
  // console.log(JSON.parse(res));
  // console.log(res);
  
      
      // console.log(ifm)
}

new SiyuanUtils()

    
 



    
  
  