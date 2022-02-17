import config from "./config"
class quickAttrs{

  constructor(editor,setting){
    if(!setting.user.customAttrs){
      console.log('配置为空')
      return
    }else{
      this.customAttrs = Object.values(setting.user.customAttrs)
    }
    
    
    this.setting = setting
    this.createMenu()
    this.popuping = false
    this.cur = 0
    this.protyle = editor
    this.protyle.addEventListener('keyup',(e)=>{
      this.handleKeyUpEvent(e)
    })
    this.protyle.addEventListener('keydown',(e)=>{
      this.handleKeyDownEvent(e)
    })
    this.protyle.addEventListener('keypress',(e)=>{
      this.handleKeyPressEvent(e)
    })
  }

  handleKeyUpEvent(e){
    // console.log('up')
    
    if(this.popuping && e.key == ' '){
      e.stopPropagation()
      e.preventDefault()
      this.switchMenuItem(e)
      return
    }
    
     // 设置菜单位置坐标
    let cursor = this.getSelectionCoords()
    this.popupMenu.style.left = cursor.x + 10 + 'px'
    this.popupMenu.style.top  = cursor.y + 20 + 'px'

    this.selection = window.getSelection()
    
    let currentCursor = this.selection.anchorOffset //当前光标位置
    this.atX = this.selection.focusNode.data ? this.selection.focusNode.data.lastIndexOf('@') : -1

    // this.lastRange = document.createRange()
    this.lastRange = this.selection.getRangeAt(0).cloneRange()
    let temp = this.lastRange.startContainer.parentNode.innerText
    this.lastContent = temp.slice(currentCursor)
    // console.log(this.lastContent)
    
    // 如果内容中包含 @ 则展示菜单 
    if(this.atX > -1){
      let start = this.atX + 1
      let end = this.selection.focusOffset
      if(start <= end){
        let range = document.createRange()
        range.setStart(this.selection.focusNode,start)
        range.setEnd(this.selection.focusNode,end)
        let txt = currentCursor == this.atX + 1 ? '@' : range.toString() //如果当前光标定位在@，则展示所有候选菜单项，否则查询 @ 后面的内容
        let html = this.getSuggestions(txt)
        if(html){
          this.popupMenu.innerHTML = html
          this.showMenu()
        }else{
          this.showMenu(false)
        }
      }else{
        this.showMenu(false)
      }
      
    }else{
      this.showMenu(false)
    }

  }

  handleKeyDownEvent(e){
    /* if(this.popuping && (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowRight')){
      e.stopPropagation()
      e.preventDefault()
    } */
    // console.log('down')
    if(this.popuping && (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == ' ')){
      e.stopPropagation()
      e.preventDefault()
      this.switchMenuItem(e)
      return
    }
  }

  handleKeyPressEvent(e){
    // console.log(e)
    if(this.popuping && (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == ' ')){
      e.stopPropagation()
      e.preventDefault()
    }

    /* console.log(e)
    if(e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'Enter'){
      this.switchMenuItem(e)
      return
    } */
  }

  createMenu(){
    //创建遮罩 mask
    this.mask = document.createElement('div')
    this.mask.className = 'popup-mask'
    document.querySelector('body').appendChild(this.mask)
    this.mask.addEventListener('click',()=>{
      this.showMenu(false)
    })

    // 创建 popup 菜单
    this.popupMenu = document.createElement('div')
    this.popupMenu.id = 'popup'
    document.body.appendChild(this.popupMenu)


  }

  // 方向键移动菜单
  switchMenuItem(e){
    e.stopPropagation()
    e.preventDefault()
    let popupItems = document.querySelectorAll('.popup-item')
    switch (e.key) {
      case 'ArrowUp': //up
        if(this.cur == -1){ cur = popupItems.length - 1}
        else{ 
          popupItems[this.cur].classList.remove('on')
          this.cur -=1
          }
          if(this.cur < 0){ this.cur = popupItems.length - 1}
          popupItems[this.cur].classList.add('on')
        break;
      case 'ArrowDown': //down
        if(this.cur == -1){ this.cur = 0}
        else{
          popupItems[this.cur].classList.remove('on')
          this.cur++
        }
        if(this.cur >= popupItems.length) this.cur = 0
        popupItems[this.cur].classList.add('on')
        break
      case ' ': 
        this.clickMenuItem()
        break
      default:
        break;
    }
  }

  // 展现菜单
  showMenu(show=true){
    if(show){
      this.popuping = true
      this.popupMenu.style.display = 'block'
      this.mask.style.display = 'block'
    }else{
      this.popuping = false
      this.popupMenu.style.display = 'none'
      this.mask.style.display = 'none'
    }
  }

  // 获得匹配菜单项
  getSuggestions(txt){
    let html ='',i = 0
    if(this.customAttrs.length > 0){
      this.customAttrs.forEach(item => {
        // 当 txt 为 @ 时展示所有选项
        if(txt == '@' || (txt !='@' && item.attrName.indexOf(txt) > -1)){
          i++
          html += `<div class="popup-item ${i==1?'on':''}" data-key="${item.attrKey}" data-value="${item.attrValue}">${item.attrName}</div>`
        }
      })
    }
  return html 
  }

  // 点击菜单项
  clickMenuItem(){
    let popupItems = document.querySelectorAll('.popup-item')
    if (this.cur != -1){
      let item = popupItems[this.cur]
      item.classList.remove('on')
      let text = item.innerText;
      let key = 'custom-' + item.getAttribute('data-key')
      let value = item.getAttribute('data-value')

      this.cur = 0
      /* let selection = window.getSelection()
      let range = document.createRange()
      range.setStart(selection.focusNode,0)
      range.setEnd(selection.focusNode,selection.focusOffset)
      let t = range.toString() */
      
      let data = {}
      data[key] = value
      this.saveAttrs2(key,value)
      this.editContent(text)
    } 
          
    this.showMenu(false)
  }

  // 编辑块内容
  editContent(html,type='insert') {
    let selection = window.getSelection()
    // 由于官方回车事件无法阻止，会产生新行，因此需要删除
    let newLine = selection.getRangeAt(0).startContainer
    // newLine.parentNode.remove()

    let lastRange = this.lastRange
    let textNode
    if(type == 'insert'){
      textNode = document.createTextNode('@'+html + this.lastContent +' ')
    }else{
      textNode = document.createTextNode('')
    }
    
    let delRange = document.createRange()
    let lastNode = this.lastRange.startContainer
    delRange.setStart(lastNode,this.atX)
    delRange.setEnd(lastNode,lastNode.length)
    delRange.deleteContents()
   
    lastRange.insertNode(textNode)
    lastRange.setStartAfter(textNode)
    lastRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(lastRange)
    
  }

  saveAttrs2(key,value){

    let parentNode = this.lastRange.startContainer.parentNode.parentNode
    let blockId = parentNode.getAttribute('data-node-id')
    parentNode.setAttribute(key,value)
    
    /* 触发 protyle 的 input 事件实现保存，不走 setAttrs 接口 */
    let protyle = document.querySelector('.protyle-wysiwyg.protyle-wysiwyg--attr')
    let e = document.createEvent('HTMLEvents')
    e.initEvent('input',true,false)
    protyle.dispatchEvent(e)

  }

  saveAttrs(value){
   

    let parentNode = this.lastRange.startContainer.parentNode.parentNode
    let blockId = parentNode.getAttribute('data-node-id')

    // 保存属性
    const data = { 'id':blockId, 'attrs':value };
    fetch(config.baseUrl + '/api/attr/setBlockAttrs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(data), 
      }).then(res=>{  return res.json()
      }).then(res=>{  
        parentNode.classList.add('popup-success')
        setTimeout(()=>{
          parentNode.classList.remove('popup-success')
        },1000)
        

      }).catch(err=>{
        console.log('设置属性失败：'+ err)
        parentNode.classList.add('popup-error')
        setTimeout(()=>{
          parentNode.classList.remove('popup-error')
        },1000)
      })
    
    
  }

  // 获取光标绝对位置
  getSelectionCoords(win) {
    win = win || window;
    var doc = win.document;
    var sel = doc.selection, range, rects, rect;
    var x = 0, y = 0;
    if (sel) {
      if (sel.type != "Control") {
        range = sel.createRange();
        range.collapse(true);
        x = range.boundingLeft;
        y = range.boundingTop;
      }

    } else if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0).cloneRange();
          if (range.getClientRects) {
            range.collapse(true);
            rects = range.getClientRects();
            if (rects.length > 0) {
                rect = rects[0];
            }
            // 光标在行首时，rect为undefined
            if(rect){
                x = rect.left;
                y = rect.top;
            }
          }
          // Fall back to inserting a temporary element
          if ((x == 0 && y == 0) || rect === undefined) {
            var span = doc.createElement("span");
            if (span.getClientRects) {
              // Ensure span has dimensions and position by
              // adding a zero-width space character
              span.appendChild( doc.createTextNode("\u200b") );
              range.insertNode(span);
              rect = span.getClientRects()[0];
              x = rect.left;
              y = rect.top;
              var spanParent = span.parentNode;
              spanParent.removeChild(span);
              // Glue any broken text nodes back together
              spanParent.normalize();
            }
          }
        }
    }
    return { x: x, y: y };
  }


}

export default quickAttrs