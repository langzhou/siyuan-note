import lodash from 'lodash'
import { sysConfig } from './utils/config'
import { getSettings, setSettings } from './utils/common'
import SearchBox from './libs/SearchBox'
import Comment from './libs/Comment'
import ImageShare from './libs/ImageShare'

class SiyuanUtils{
  constructor(){
    this.init()
  }

  init(){
    this.appendElements()
    this.searchBox = new SearchBox()
    this.comment = new Comment()
    this.handleEvents()
    this.domWatcher()
  }

  /* 事件委托 */
  handleEvents(){
    // 按键按下事件
    window.addEventListener('keydown',e =>{
      this.shortcutKey(e)
      if(this.searchBox) this.searchBox.handleKeyDown(e)
      if(this.comment) this.comment.handleKeyDown(e)
    })

    // 输入防抖
    window.addEventListener('keyup',lodash.debounce(e =>{
      if(this.searchBox) this.searchBox.handleInput(e)
    },800))

    // 按键弹起事件
    window.addEventListener('keyup',e =>{
      if(this.searchBox) this.searchBox.actionTrigger(e)
    })

    // 鼠标单击事件
    window.addEventListener('click',e =>{
      if(this.comment) this.comment.showBox(e)
    })

    // 鼠标松开事件
    window.addEventListener('mouseup',e =>{
      if(this.comment) this.comment.handleSelectionEvent(e)
    })
  }

  /* 快捷键注册 */
  shortcutKey(e){
    // shift+alt+s 弹出图片分享
    if(e.shiftKey && e.altKey && e.code =='KeyS'){
      e.preventDefault()
      e.stopPropagation()
      if(!this.imageShare){
        this.imageShare = new ImageShare()
      }
      this.imageShare.showBox()
    }
    
    // shift+alt+p 弹出快捷搜索框
    if(e.shiftKey && e.altKey && e.code =='KeyP'){
      e.preventDefault()
      e.stopPropagation()
      if(this.searchBox){
        this.searchBox.create()  //创建搜索框
        this.searchBox.showBox() //展示搜索框
      }
    }
  }

  /* 检测 dom 变动，用于动态插入元素 */
  domWatcher(){
    var targetNode = document.querySelector('.layout__center.fn__flex.fn__flex-1'); 
    if(!targetNode){
      setTimeout(() => { this.domWatcher() }, 300);
    }else{
      const config = { attributes: false, childList: true, subtree: true };
      const callback = (mutationsList, observer) =>{
          for(let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                this.childListChangedHook(mutation)
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


  /* 处理观察对象节点变动事件 */
  childListChangedHook(mutation){
    // 监听 node added 事件
    if(mutation.addedNodes){
      let node = mutation.addedNodes.item(0)
      // 新增 protyle 节点，即判断为打开了新文档
      if(node &&  node.className == 'fn__flex-1 protyle'){
        // 因为 dom 树可能没有完全加载，需要延迟处理
        setTimeout(()=>{
          if(this.comment) {
            this.comment.appendToolbarBtn()
            this.comment.resolveCommentNodes()
          }
        },1000)
      }
    }
  }

  /* 插入元素 */
  appendElements(){
    let fragment = document.createDocumentFragment()
    let elementCss = document.createElement('link')
    elementCss.setAttribute('rel','stylesheet')
    elementCss.setAttribute('type','text/css')
    elementCss.setAttribute('href',sysConfig.widgetPath+'/css/element.css')
    fragment.appendChild(elementCss)
    let css = document.createElement('link')
    css.setAttribute('rel','stylesheet')
    css.setAttribute('type','text/css')
    css.setAttribute('href',sysConfig.widgetPath+'/css/siyuan-utils.css')
    fragment.appendChild(css)
    document.head.appendChild(fragment)
  }
}

new SiyuanUtils()