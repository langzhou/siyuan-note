import lodash from 'lodash'
import { sysConfig } from './utils/config'
import { getSettings, setSettings } from './utils/common'
import SearchBox from './libs/SearchBox'
import Comment from './libs/Comment'

class SiyuanUtils{

  constructor(){
    // console.log(sysConfig);
    let data = {
      name:'jay'
    }
    setSettings(data,'sys') 
    // console.log((getSettings('sys')));
    this.init()
  }

  init(){
    this.appendElements()
    this.searchBox = new SearchBox()
    this.comment = new Comment()
    this.handleEvents()
    this.domWatcher()

    fetch('./widgets/siyuan-utils2/settings.json')
      .then(res=> res.json().then(data=>console.log(data)))
      .catch(err=>console.log(err))

  }

  /* 事件委托 */
  handleEvents(){
    window.addEventListener('keydown',e =>{
      if(this.searchBox) this.searchBox.handleKeyDown(e)
      if(this.comment) this.comment.handleKeyDown(e)
    })

    // 输入防抖
    window.addEventListener('keyup',lodash.debounce(e =>{
      if(this.searchBox) this.searchBox.handleInput(e)

    },800))

    window.addEventListener('keyup',e =>{
      if(this.searchBox)  this.searchBox.actionTrigger(e)
    })

    window.addEventListener('click',e =>{
      if(this.comment) this.comment.showBox(e)
    })

    window.addEventListener('mouseup',e =>{
      if(this.comment) this.comment.handleSelectionEvent(e)
    })

  }


  /* 检测 dom 变动，用于动态插入元素 */
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


  /* 处理观察对象节点变动事件 */
  childListChangedHook(mutation){
    // 监听 node added 事件
    if(mutation.addedNodes){
      let node = mutation.addedNodes.item(0)
      // 新增 protyle 编辑器，即打开了新文档
     
      if(node &&  node.className == 'fn__flex-1 protyle'){
        // 因为 dom 树可能没有完全加载，需要延迟处理
        console.log(node);
        setTimeout(()=>{
          if(this.comment) {
            this.comment.appendToolbarBtn()
            this.comment.resolveCommentNodes()
          }
          // console.log('change');
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
    elementCss.setAttribute('href','./widgets/siyuan-utils2/css/element.css')
    fragment.appendChild(elementCss)
  
    let css = document.createElement('link')
    css.setAttribute('rel','stylesheet')
    css.setAttribute('type','text/css')
    css.setAttribute('href','./widgets/siyuan-utils2/css/siyuan-utils.css')
    fragment.appendChild(css)
  
    document.head.appendChild(fragment)
  }
}

new SiyuanUtils()