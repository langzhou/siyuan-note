import dayjs from 'dayjs'
export default class attrsMenu{

  constructor(editor, setting){
    // 获取用户配置的属性列表
    if(!setting.user.customAttrs){
      console.log('用户属性配置为空')
      return
    }else{
      this.customAttrs = Object.values(setting.user.customAttrs)
    }

    this.setting        = setting
    this.popuping       = false   //是否弹出菜单
    this.menuItemIndex  = 0       //选中菜单项index
    this.protyle        = editor  //用来监听事件

    this.createMenu()
    this.protyle.addEventListener('keyup',    e => this.handleKeyUpEvent(e))
    this.protyle.addEventListener('keydown',  e => this.handleKeyDownEvent(e))
    this.protyle.addEventListener('keypress', e => this.handleKeyPressEvent(e))
  }

  /* 创建菜单 */
  createMenu(){
    // 创建遮罩，点击时关闭菜单
    this.mask = document.createElement('div')
    this.mask.className = 'popup-mask'
    document.body.appendChild(this.mask)
    this.mask.addEventListener('click',()=> this.showMenu(false))

    // 创建 popup 菜单
    this.popupMenu = document.createElement('div')
    this.popupMenu.id = 'popup'
    document.body.appendChild(this.popupMenu)
  }

  /* 当菜单弹出时，阻止方向键和空格等键盘原生事件 */
  handleKeyDownEvent(e){
    // console.log('down..')
    if(this.popuping && (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == ' ')){
      e.stopPropagation()
      e.preventDefault()
      this.switchMenuItem(e)
    }
  }

  /* 当菜单弹出时，阻止方向键和空格等键盘原生事件 */
  handleKeyPressEvent(e){
    // console.log('press..')
    if(this.popuping && (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == ' ')){
      e.stopPropagation()
      e.preventDefault()
    }
  }

  /* 监听事件，匹配属性弹出菜单 */
  handleKeyUpEvent(e){
    // console.log('up...')
    if(this.popuping && (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == ' ')){
      e.preventDefault()
      e.stopPropagation()
      return
    }

    // 响应键盘输入，实时调整 popup 菜单坐标位置
    let cursor = this.getCurPosition()
    this.popupMenu.style.left = cursor.x + 10 + 'px'
    this.popupMenu.style.top  = cursor.y + 20 + 'px'

    this.selection = window.getSelection()
    this.atX = this.selection.focusNode.data ? this.selection.focusNode.data.lastIndexOf('@') : -1 //@符号的位置
    let currentCursor = this.selection.anchorOffset //当前光标位置
    // 如果内容中包含 @ 则展示菜单 
    if(this.atX > -1){
      let rangeStart = this.atX + 1
      if(rangeStart <= currentCursor){
        let range = document.createRange() //构建选取，截取@查询文本
        range.setStart(this.selection.focusNode, rangeStart)
        range.setEnd(this.selection.focusNode, currentCursor)
        let queryTxt = currentCursor == this.atX + 1 ? '@' : range.toString()
        let html = this.getMenuItems(queryTxt) //获取菜单项 html
        if(html){
          this.popupMenu.innerHTML = html
          this.showMenu()
        }else{
          this.showMenu(false)
        }
      }
    }else{
      this.showMenu(false)
    }
  }

  /* 方向键移动菜单项 */
  switchMenuItem(e){
    e.stopPropagation()
    e.preventDefault()
    let popupItems = document.querySelectorAll('.popup-item') //获得全部菜单项
    switch (e.key) {
      case 'ArrowUp': //up
        if(this.menuItemIndex == -1){ cur = popupItems.length - 1}
        else{ 
          popupItems[this.menuItemIndex].classList.remove('on')
          this.menuItemIndex -=1
          }
          if(this.menuItemIndex < 0){ this.menuItemIndex = popupItems.length - 1}
          popupItems[this.menuItemIndex].classList.add('on')
          this.scrollMenu()
        break;
      case 'ArrowDown': //down
        if(this.menuItemIndex == -1){ this.menuItemIndex = 0}
        else{
          popupItems[this.menuItemIndex].classList.remove('on')
          this.menuItemIndex++
        }
        if(this.menuItemIndex >= popupItems.length) this.menuItemIndex = 0
        popupItems[this.menuItemIndex].classList.add('on')
        this.scrollMenu()
        break
      case ' ': 
        this.selectMenuItems()
        break
      default:
        break;
    }
  }
  /* 菜单页面滚动 */
  scrollMenu(){
    let index = this.menuItemIndex ,
        menu  = document.querySelector('#popup') ,
        items = document.querySelectorAll('.popup-item') ,
        itemsCount  = items.length ,
        itemHeight  = items[0].scrollHeight ,
        menuHeight  = menu.clientHeight ,
        menuScrollHeight = menu.scrollHeight ,
        menuScrollTop = menu.scrollTop

    if( (index+1) * itemHeight - menuScrollTop > menuHeight ){
      menu.scrollTop += itemHeight
    }
    if( index * itemHeight < menuScrollTop){
      menu.scrollTop -= itemHeight
    }
    if( index == 0){
      menu.scrollTop = 0
    }
    if( index == itemsCount - 1){
      menu.scrollTop = menuScrollHeight - menuHeight
    }


  }

  /* 展现菜单 */
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

  /* 根据用户输入的文本查询匹配项 */
  getMenuItems(queryTxt){
    let html = '', i = 0
    if(this.customAttrs.length > 0){
      this.customAttrs.forEach(item => {
        if(queryTxt == '@' || (queryTxt != '@' && item.attrName.indexOf(queryTxt) > -1 )){
          i++
          html += `<div class="popup-item ${i==1?'on':''}" data-key="${item.attrKey}" data-value="${this.convertAttrValue(item.attrValue)}">${item.attrName}</div>`
        }
      })
    }
    return html
  }

  /* 正则转换 */
  convertAttrValue(value){
    let reg = /\{\s*(today|tomorrow|(\d+)\s*(days))\s*\|?\s*(\S*)\s*\}/,
        result = value.match(reg),
        newValue

    if(result){
      let type       = result[3] || result[1] ,
          daysNumber = result[2] || 0 ,
          format     = result[4] ? result[4] : 'YYYYMMDD'
      
      switch (type) {
        case 'today':
          newValue =  dayjs().format(format)
          break;
        case 'tomorrow':
          newValue = dayjs().add(1,'day').format(format)
          break
        case 'days':
          newValue = dayjs().add(daysNumber,'day').format(format)
          break 
        default:
          break;
      }
      return newValue
    }else{
      return value
    }

    
  }

  /* 选中菜单项 */
  selectMenuItems(){
    let popupItems = document.querySelectorAll('.popup-item')
    if(this.menuItemIndex != -1){
      let item  = popupItems[this.menuItemIndex] ,
          text  = item.innerText ,
          key   = 'custom-' + item.getAttribute('data-key') ,
          value = item.getAttribute('data-value')
      item.classList.remove('on')
      this.menuItemIndex  = 0 //重置选中位置
      this.editBlock(value) //更改块内容，如果放在保存属性之后，则可能会导致文本保存不成功
      this.saveAttrs(key,value) //保存属性
    }
    this.showMenu(false)
  }

  /* 保存属性设置 */
  saveAttrs(key, value){
    let blockNode = this.selection.getRangeAt(0).startContainer.parentNode
    blockNode = blockNode.parentNode.classList.contains('li') ? blockNode.parentNode : blockNode //如果是列表项，则将属性保存在 li 节点，而不是 p 节点
    blockNode.classList.add('popup-success') //通过背景色提示成功
    
    setTimeout(()=>{
      blockNode.classList.remove('popup-success')
      if(!value){
        blockNode.removeAttribute(key)
      }else{
        blockNode.setAttribute(key, value) 
      }
      
      let protyle = document.querySelector('.fn__flex-1.protyle:not(.fn__none) .protyle-wysiwyg.protyle-wysiwyg--attr') //需要获取到当前正在编辑的 protyle
      let e = document.createEvent('HTMLEvents')
      e.initEvent('input',true,false)
      protyle.dispatchEvent(e)

      // 保险起见，同时调用接口保存属性
      let blockId = blockNode.getAttribute('data-node-id')
      let attr = {}
      attr[key] = value
      let data = {id: blockId, attrs:attr}
      fetch(this.setting.baseUrl + '/api/attr/setBlockAttrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data), // "{"name":"Billy","age":18}"
      }).then(res=>{ return res.json()
      }).then(res=>{
        if(res.code != 0){ console.warn('属性设置失败')}
      })

    },800)
  }

  /* 编辑块内容 */
  editBlock(txt){
    let textNode ,  keepAttrs = this.setting.user.keepAttrs
    if(keepAttrs){
      // 在内容块中保留属性设置文本
      textNode = document.createTextNode('@' + txt + ' ')
    }else{
      textNode = document.createTextNode('')
    }

    let currentRange = this.selection.getRangeAt(0),
        node         = currentRange.startContainer,    
        delRange     = document.createRange()
    // 先删除 @到光标位置的内容，然后再插入新内容
    delRange.setStart(node, this.atX)
    delRange.setEnd(node, node.length)
    delRange.deleteContents()

    // 插入新内容
    currentRange.insertNode(textNode)
    currentRange.setStartAfter(textNode)
    currentRange.collapse(true)
    this.selection.removeAllRanges()
    this.selection.addRange(currentRange)
  }

  /* 获取光标绝对位置 */
  getCurPosition(win) {
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

