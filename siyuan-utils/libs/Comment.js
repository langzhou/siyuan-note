/* 内容块评论 */
import dayjs from "dayjs"
import icons from "../utils/icons"
import { setAttrs } from "../utils/network"
import { snackbar, computeBoxPosition, saveViaTransaction, randomString } from "../utils/common"

class Comment {

  constructor(){
    this.isShow = false
    this.appendToolbarBtn()
    setTimeout(()=>this.resolveCommentNodes(),1000) //等待文章内容加载完整
    
  }
  

  handleKeyDown(e){
    // 监听组合快捷键(暂时没用)
    if(e.shiftKey && e.altKey && e.code =='KeyC'){
      e.preventDefault()
      e.stopPropagation()
      this.showBox(e)
    }

    // 回车键提交评论
    if(this.isShow && e.key == 'Enter'){
      e.preventDefault()
      e.stopPropagation()
      this.addComment()
    }

    if(this.isShow && e.key == 'Escape'){
      this.hiddenBox()
    }
  }

  /**
   * 响应文本选择事件
   * @param {*} e 
   */
  handleSelectionEvent(e){
    let node = e.target, inProtyle = false
    // 判断事件是否发生在 protyle 中
    while(node != document){
      if(node.classList.contains('protyle-wysiwyg')){
        inProtyle = true
        break
      }
      node = node.parentNode
    }

    if(inProtyle){
      let selection = getSelection()
      // 获得文本选择事件的坐标，用于确定弹出 comment box 的位置 
      if(selection.rangeCount > 0 && selection.getRangeAt(0).toString()){
        this.selectionX = e.clientX
        this.selectionY = e.clientY
      }else{
        this.selectionX = null
        this.selectionY = null
      }
    }
  }


  /* 解析文章中的 comment 元素 */
  resolveCommentNodes(){
    let elements = document.querySelectorAll('strong[style*="quote"]')
    if(elements){
      elements.forEach((item,index,node)=>{
        // 在内容块右侧添加图标
        this.createBlockIcon(item.parentElement) 
      })
    }
  }

  /**
   * 在内容块右侧添加图标
   * @param {*} contentBlock 
   */
  createBlockIcon(contentBlock){
    let sibling = contentBlock.nextSibling
    if(sibling && !sibling.querySelector('.protyle-attr--comment')){
      let div = document.createElement('div')
      div.className = 'protyle-attr--comment'
      div.innerHTML = icons.comment
      div.addEventListener('click',(e)=>this.showBox(e))
      contentBlock.nextSibling.appendChild(div)
    }
  }

  /**
   * 新增 block （for test）
   */
  createBlock(){
    let now = dayjs().format('YYYYMMDDHHmmss')
    let protyle = document.querySelector('.fn__flex-1.protyle:not(.fn__none) .protyle-wysiwyg.protyle-wysiwyg--attr') //需要获取到当前正在编辑的 protyle
    let nodeId =  now + '-' + randomString(7)
    console.log(nodeId);
    let block = document.createElement('div')
    block.setAttribute('data-node-id',nodeId)
    block.setAttribute('data-type','NodeParagraph')
    block.setAttribute('update',now)
    block.setAttribute('data-eof',true)
    block.setAttribute('data-node-index',7)
    block.className = 'p'
    block.innerHTML = 
    `<div contenteditable="true" spellcheck="false">Test block</div><div class="protyle-attr" contenteditable="false"></div></div>`
    console.log(block);
    protyle.appendChild(block)
    let selection = getSelection()
    let range = document.createRange()
    range.setStartAfter(block)
    selection.removeAllRanges()
    selection.addRange(range)

    saveViaTransaction()
  }

  /**
   * 弹出 box
   * @param {*} e 
   */
  showBox(e){
    let show        = false, //用来决定是否弹出 box
        from        = '',   //判断弹出 box 点击来源
        x           = e.clientX, //事件坐标，用于计算弹框位置
        y           = e.clientY,
        target      = e.target,
        parent      = target.parentNode || target,
        grandParent = parent.parentNode || target, //可能会点击到按钮中的svg、path 元素，所以需要获取父级元素
        style       = target.getAttribute('style') //获取 strong 的 style 属性

    // 如果之前不存在box，则创建
    if(!this.box){ this.createBox() }

    // 首先根据点击事件来源决定哪些情况下要弹出 box
    if(target.getAttribute('data-type') == 'comment' || parent.getAttribute('data-type') == 'comment' || grandParent.getAttribute('data-type') == 'comment'){
      // 点击 toolbar 图标触发
      e.stopPropagation()
      let selection = getSelection() ,
          range     = selection.getRangeAt(0)
      if(range){
        // 需要进一步判断选取是否是在 strong 标签里面
        let start = range.startContainer, end = range.endContainer
        if(start.parentElement.tagName == 'STRONG' || end.parentElement.tagName == 'STRONG'){
          snackbar('请在非评论区操作','warning')
        }else if(!range.toString()){
          snackbar('没有选中内容','danger')
        }else{
          this.range = range // 因为弹出 box 后，选区会消失，所以提前存储 range
          show = true   
          from = 'toolbar' 
        }
      }
      
    }else
    if(style && style.indexOf('quote') > -1 && getSelection().toString() == ''){
      // 点击 block 引文触发
      e.stopPropagation()
      show = true
      from = 'block'
      this.range = getSelection().getRangeAt(0)
    }else 
    if(target.classList.contains('protyle-attr--comment')  || parent.classList.contains('protyle-attr--comment') || grandParent.classList.contains('protyle-attr--comment')){
      // 点击内容块右侧图标触发
      e.stopPropagation()
      show = true
      from = 'attr'
    }
   
    if(show){
      this.isShow = true
      this.box.style.display = 'block'
      this.overlay.style.display = 'block'
      if(from == 'attr'){
        this.add.style.display = 'none' //点击attr区图标时不展示输入框
      }else{
        this.add.style.display = 'flex'
        this.input.focus()
      }
      
      this.getComments(target,from) //获取评论列表

      // 如果是从 toolbar 触发，box 的坐标不参照事件坐标，而是参照文本选区坐标
      if(from == 'toolbar'){
        x = this.selectionX || x
        y = this.selectionY || y
      }
      let p = computeBoxPosition(this.box, x, y)
      this.box.style.left = p.x + 'px'
      this.box.style.top  = p.y + 'px'
    }
  }

  /**
   * 获取评论列表
   * @param {string} node 触发事件的元素
   * @param {string} from 模式：toolbar 工具条；attr 属性图标；block 内容块
   */
  getComments(node,from){
    let html = ''
    switch (from) {
      case 'toolbar':
        html = `<div class="quote">${this.range.toString()}</div>`
        this.list.innerHTML = html
        break
      case 'attr':
        let item = node
        // 获得所在 block
        while(!item.getAttribute('data-node-id')){
          item = item.parentNode
        }
        let attrs = item.attributes
        html = ''
        for (let i = 0; i < attrs.length; i++) {
          let attrName = attrs[i].nodeName;
          let attrValue = attrs[i].nodeValue;
          if(attrName.indexOf('quote') > -1){
            attrValue = JSON.parse(attrValue)
            html += this.createListHtml(attrValue)
          }
          this.list.innerHTML = html
        }
        break
      case 'block':
        let quoteId = node.getAttribute('style');
        if(quoteId && quoteId.indexOf('quote') > -1){
          html = ''
          let data = document.querySelector(`[custom-${quoteId}]`)
          if(!data) return 
          data = JSON.parse(data.getAttribute(`custom-${quoteId}`).replace(/&quot;/g,'"'))
          if(data){
            let quote = data['quote'],
                obj   = data['comments']
            html += `<div class="quote">${quote}<span class="delete-quote" data-quote-id="${quoteId}">移除引文</span></div>`
            for(let key in obj){
              html += `
              <div class="list-item">
                <div class="header">
                  <div class="date">${obj[key]['date']}</div>
                  <div class="delete-comment" data-quote-id="${quoteId}" data-comment-id="${obj[key]['id']}">移除评论</div>
                </div>
                <div class="comment">${obj[key]['comment']}</div>
              </div>
            `
            }
          
          }
          this.input.setAttribute('data-quote-id',quoteId)
          this.list.innerHTML = html
        }
        break
      default:
        break;
    }
  }

  createListHtml(data){
    let html    = '',
        quoteId = data['quote_id'],
        quote   = data['quote'],
        obj     = data['comments']
    html += `<div class="quote">${quote}<span class="delete-quote" data-quote-id="${quoteId}">移除引文</span></div>`
    for(let key in obj){
      html += `
      <div class="list-item">
        <div class="header">
          <div class="date">${obj[key]['date']}</div>
          <div class="delete-comment" data-quote-id="${quoteId}" data-comment-id="${obj[key]['id']}">移除评论</div>
        </div>
        <div class="comment">${obj[key]['comment']}</div>
      </div>
    `
    }
    return html

  }

  /* 
  ** 新增评论
   *
   */
  addComment(){
    // 输入框内容为空
    if(!this.input.innerText){
      this.hiddenBox()
      return
    }

    // 如果已有 quoteid，则是追加，否则是新增
    let quoteId = this.input.getAttribute('data-quote-id')
    if(quoteId){
      // 追加评论
      let block = document.querySelector(`div[custom-${quoteId}]`)
      let data = block.getAttribute('custom-' + quoteId) //获得之前评论数据
      if(data){
        let commentId = 'quote-'+ dayjs().format('YYYYMMDDHHmmss')
        data = JSON.parse(data)
        data['comments'][commentId] = {
          id: commentId,
          date:dayjs().format('YYYY/MM/DD HH:mm:ss'),
          comment:this.input.innerHTML
        }
        block.setAttribute('custom-'+quoteId,JSON.stringify(data))

        let selection = getSelection()
        selection.removeAllRanges()
        selection.addRange(this.range) // 使得 protyle 获得光标
        this.hiddenBox()
      }else{
        // 可能存在 strong 标签还在 block 中属性不存在的情况
      }

    }else{
      // 全新评论
      let selection = getSelection()
      let range     = this.range
      let start     = range.startContainer
      let block     = start.parentElement.parentElement //由于没有一炮三响了，所以列表项上无法在属性弹框中看到存储的评论内容
      let txt       = range.toString()
      range.deleteContents()
      let strongNode = document.createElement('strong')
      strongNode.innerText = txt
      let id = dayjs().format('YYYYMMDDHHmmss'),
          quoteId   = 'quote-'+ id,
          commentId = 'comment-' + id
      let data = {
        id:commentId,
        date: dayjs().format('YYYY/MM/DD HH:mm:ss'),
        comment:this.input.innerHTML
      }

      let comments = {}
      comments[commentId] = data

      let attrValue = JSON.stringify({
        quote_id: quoteId,
        quote: txt,
        comments: comments
      })
        
      strongNode.setAttribute('style',quoteId)
      block.setAttribute('custom-' + quoteId,attrValue)
      range.insertNode(strongNode)
      range.setStartAfter(strongNode)
      range.collapse(true) //取消文本选择状态
      selection.removeAllRanges()
      selection.addRange(range)
      this.hiddenBox()
    }
    saveViaTransaction()
  }

  /**
   * 挖空
   */
  addBlank(){
    let selection = getSelection()
    let range = selection.getRangeAt(0)
    let txt = range.toString()
    let strongNode = document.createElement('strong')
    strongNode.innerText = txt
    strongNode.setAttribute('style','blank')
    range.deleteContents()
    range.insertNode(strongNode)
    range.setStartAfter(strongNode)
    saveViaTransaction()
  }

  /**
   * 评论输入框支持粘贴内容块链接
   * @param {*} e 
   */
  handlePaste(e){
    e.stopPropagation()
    const clipdata = e.clipboardData || window.clipboardData;
    const data = clipdata.getData("text/plain")
    let selection = getSelection()
    if(data && selection.toString()){
      let reg1 = /.*\(\((\d{14}-.*)\)\).*/              //匹配格式：((20210815214330-btqo1b2))
      let reg2 = /.*siyuan:\/\/blocks\/(\d{14}-\S{7})/  //匹配格式：siyuan://blocks/20210815214330-btqo1b2
      let result = data.match(reg1) || data.match(reg2)
      if(result){
        e.preventDefault()
        let link = document.createElement('a')
        link.setAttribute('href','siyuan://blocks/' + result[1])
        link.innerText = selection.toString()
        let range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(link)
        range.setStartAfter(link)
      }
    }
  }

  /* 评论列表事件，主要是移除评论和引文 */
  handleListEvents(e){
    e.stopPropagation()
    let target = e.target
    // 删除评论
    if(target.className == 'delete-comment'){
      let quoteId   = target.getAttribute('data-quote-id')
      let commentId = target.getAttribute('data-comment-id')
      let block     = document.querySelector(`[custom-${quoteId}]`)
      if(block){
        let blockId = block.getAttribute('data-node-id')
        let attr    = 'custom-' + quoteId
        let data = JSON.parse(block.getAttribute(attr)) //先获取之前的数据
        delete data['comments'][commentId]
        let newData = JSON.stringify(data)
        block.setAttribute(attr ,newData)

        let temp = {}
        temp[attr] = newData
        setAttrs({
          "id":blockId,
          "attrs": temp
        })
        target.parentNode.parentNode.remove()
      }
      return
    }

    if(target.className == 'delete-quote'){
      let quoteId   = target.getAttribute('data-quote-id'),
          block     = document.querySelector(`[custom-${quoteId}]`),
          quoteNode = document.querySelector(`strong[style="${quoteId}"]`)
      if(block){
        // 移除 block 中的属性
        let blockId = block.getAttribute('data-node-id')
        block.removeAttribute(`custom-${quoteId}`)
        let temp = {}
        temp[`custom-${quoteId}`] = ''
        setAttrs({
          id: blockId,
          attrs: temp
        })
      }
      if(quoteNode){
        // 移除 strong 标签
        let selection = getSelection(),
            range     = document.createRange(),
            text      = document.createTextNode(quoteNode.innerText)
        range.setStart(quoteNode.firstChild,0)
        range.setEnd(quoteNode.firstChild,quoteNode.firstChild.length )
        selection.removeAllRanges()
        selection.addRange(range) 
        quoteNode.remove()
        range.deleteContents()
        range.insertNode(text)
        range.setStartAfter(text)
        saveViaTransaction()
      }
    }
    this.hiddenBox()
  }

  createBox(){
    let fragment = document.createDocumentFragment()
      this.box = document.createElement('div')
      this.box.id = 'lz-comment-box'
      this.list = document.createElement('div')
      this.list.className = 'list'
      this.list.addEventListener('click',e => this.handleListEvents(e))

      this.add = document.createElement('div')
      this.add.className = 'add'
      this.input = document.createElement('div')
      this.input.setAttribute('contenteditable',true)
      this.input.className = 'input'
      this.input.setAttribute('placeholder','say something ..')
      this.input.setAttribute('spellcheck',false)
      this.input.setAttribute('data-quote-id','')
      this.input.addEventListener('paste',e => this.handlePaste(e))

      this.btn = document.createElement('div')
      this.btn.className = 'btn'
      this.btn.innerText = '评论'
      this.btn.addEventListener('click',()=>this.addComment())
      this.add.appendChild(this.input)
      this.add.appendChild(this.btn)

      this.overlay = document.createElement('div')
      this.overlay.className = 'lz-overlay'
      this.overlay.addEventListener('click',()=>this.hiddenBox())
      
      this.box.appendChild(this.list)
      this.box.appendChild(this.add)
      
      fragment.appendChild(this.box)
      fragment.appendChild(this.overlay)
      document.body.appendChild(fragment)
  }

  hiddenBox(){
    if(this.box) {
      this.box.style.display = 'none'
      this.overlay.style.display = 'none'
      this.input.innerText = ''
      this.input.setAttribute('data-quote-id','')
      this.isShow = false
    }
  }


  /* 往 toolbar 中添加按钮 */
  appendToolbarBtn(protyle){
    if(protyle){
      // 处理新增的 protyle
      let toolbar = protyle.querySelector('.protyle-toolbar')
      let fragment = this.createToolbarBtn()
      toolbar.appendChild(fragment)
    }else{
      // 初始化时找到所有 protyle-toolbar
      let toolbars = document.querySelectorAll('.protyle-toolbar')
      if(toolbars){
        toolbars.forEach((item,index,node)=>{
          let fragment = this.createToolbarBtn()
          item.appendChild(fragment)
        })
      }
    }
  }

  createToolbarBtn(){
    let fragment = document.createDocumentFragment()
    let divider = document.createElement('div')
    divider.className = 'protyle-toolbar__divider'
    let btn = document.createElement('button')
    btn.className = 'protyle-toolbar__item b3-tooltips b3-tooltips__n'
    btn.setAttribute('data-type','comment')
    btn.setAttribute('aria-label','评论')
    btn.innerHTML = icons.comment
    btn.addEventListener('click',(e)=>{
      btn.parentElement.classList.add('fn__none') //关闭 toolbar
      this.showBox(e)
    })
    let blankBtn = document.createElement('button')
    blankBtn.className = 'protyle-toolbar__item b3-tooltips b3-tooltips__n'
    blankBtn.setAttribute('data-type','blank')
    blankBtn.setAttribute('aria-label','挖空')
    blankBtn.innerHTML = icons.brush

    blankBtn.addEventListener('click',()=>{
      blankBtn.parentElement.classList.add('fn_none')
      this.addBlank()
    })
    fragment.appendChild(divider)
    fragment.appendChild(btn)
    fragment.appendChild(blankBtn)
    return fragment
  }
}

export default Comment