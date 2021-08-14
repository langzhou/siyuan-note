import { sysConfig } from '../utils/config'
import dropdownList from './DropdownList'
import { request } from '../utils/network'

class SearchBox{

  constructor(){
    this.searchBox    = null
    this.box          = null
    this.mask         = null
    this.isShow       = false
    this.actionName   = ''
    this.defaultPlaceHolder = '请输入命令'
    this.init()
  }

  init() {
    
  }

  handleKeyDown(e){
      
      // 移除 action 图标
      if(this.isShow && this.actionName && (e.key == 'Delete' || e.key == 'Backspace')){
        if(this.input.innerText == '') this.removeAction()
      }

      // esc 关闭搜索框
      if(this.isShow && e.key == 'Escape'){
        this.showBox(false)
      }

      // 切换列表项
      if(this.isShow && (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'Enter' || e.key == 'Tab')){
        this.dropdownList.switchItems(e)
      }

      // 选择列表项
      if(this.isShow && e.key == 'Enter'){
        this.selectItem(this.dropdownList.selectItem())
      }
    
  }

  create(){
    this.searchBox = document.querySelector('#lz-search-box')
    if(!this.searchBox){
      let fragement = document.createDocumentFragment()

      this.box = document.createElement('div')
      this.box.className = 'box'
      this.mask    = document.createElement('div')
      this.mask.className = 'mask'
      this.mask.addEventListener('click',()=>{this.showBox(false)})

      this.input = document.createElement('div')
      this.input.className = 'input'
      this.input.setAttribute('contenteditable',true)
      this.input.setAttribute('placeholder',this.defaultPlaceHolder)
      this.input.setAttribute('spellcheck',false)
      
      this.icon = document.createElement('div')
      this.icon.className = 'icon'

      this.list = document.createElement('div')
      this.list.className = 'list'
      
      this.box.appendChild(this.input)
      this.box.appendChild(this.icon)
      this.searchBox = document.createElement('div')
      this.searchBox.id = 'lz-search-box'
      this.searchBox.appendChild(this.box)
      this.searchBox.appendChild(this.list)
      this.searchBox.appendChild(this.mask)
      fragement.appendChild(this.searchBox)
      document.body.append(fragement)

      this.dropdownList = new dropdownList('#lz-search-box .list','#lz-search-box .list-item')
    }
      
  }

  async selectItem(item){
    this.showLoading()
    this.showList(false) //关闭列表项
    window.getSelection().removeAllRanges() //移除输入框焦点

    let id     = item.getAttribute('data-id'),
        pic    = item.getAttribute('data-img'),
        title  = item.getAttribute('data-title'),
        author = item.getAttribute('data-author'),
        url    = item.getAttribute('data-url'),
        year   = item.getAttribute('data-year')

    let html = await request('https://book.douban.com/subject/'+id,'','get') //访问豆瓣书目主页
    // 正则匹配获取目录信息
    let reg = /<div class="indent" id="dir_\d+_full" style="display:none">([\s\S]*?)\(<a/
    let result = html.match(reg), dir = ''
    if(result){
      dir = result[1].replace(/\s/g,'').replace(/<br\/>/g,'\n\n')
    }
    
    let content = `![img](${pic})\n\n**书目**：[${title}](${url})\n\n**作者**：${author} \n\n**出版年份**：${year}\n\n### 内容简介\n\n\n\n### 心得感悟\n\n\n\n### 书摘笔记\n\n\n\n### 相关阅读\n\n\n\n### 书籍目录\n\n\n\n${dir}`
    this.createDoc({title:`《${title}》`,content:content})
    this.showLoading(false)
    this.showBox(false)
    item.classList.remove('on')
    
  }

  /* 创建文档 */
  createDoc(doc){
    let data = {
      "notebook": '思源笔记',
      "path": '/闪念/'+ doc.title + '.sy',
      "markdown": doc.content 
    }
    request('/api/filetree/createDocWithMd',data).then(res=>{
      if(res.data)  window.open(`siyuan://blocks/${res.data}`)
    })
  }

  showBox(show=true){
    if(show){
      this.isShow = true
      this.searchBox.style.display = 'block'
      this.input.focus()
    }else{
      this.isShow = false
      this.searchBox.style.display = 'none'
      this.input.innerText = ''
      this.input.setAttribute('placeholder',this.defaultPlaceHolder)
      this.list.innerHTML = ''
      this.removeAction()
    }
  }

  showLoading(show=true){
    if(show){
      this.icon.classList.add('loading')
    }else{
      this.icon.classList.remove('loading')
    }
  }

  actionTrigger(e){
    // console.log(this.isShow);
    if(this.isShow){
      let txt = this.input.innerText
      if(!this.actionName && txt){
        if(txt.search(/^豆瓣\s/) == 0){
          this.createAction('豆瓣','请输入书籍名称')
        }
      }
    }
  }

  handleInput(e){
    if(this.input && !this.input.innerText) this.showList(false) //输入框为空则收起列表项
    // 屏蔽功能键
    let keys = ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Escape','Enter','Tab']
    if(keys.indexOf(e.key) > -1) return

    switch (this.actionName) {
      case '豆瓣':
        if(this.input.innerText)  this.getBooks(this.input.innerText)
        break;
    
      default:
        break;
    }
    
  }


  getBooks(keyword){
    // console.log('访问豆瓣...');
    let url = `https://book.douban.com/j/subject_suggest?q=${keyword}`
    fetch(url).then(
      res=>res.json()
    ).then(res=>{
        if(res.length > 0){
          this.dropdownList.createItems(res) //创建列表项
          this.showList()
        }else{
          this.showList(false)
        }
      }
    )
  }
 

  createAction(name,placeholder){
    this.actionName = name
    placeholder = placeholder || this.defaultPlaceHolder
    this.action = document.createElement('div')
    this.action.className = 'action'
    this.action.innerText = name
    this.input.innerText = ''
    this.input.setAttribute('placeholder',placeholder)
    this.box.insertBefore(this.action,this.input)
  }

  removeAction(){
    if(this.action) this.action.remove()
    this.actionName = ''
    this.input.setAttribute('placeholder',this.defaultPlaceHolder)
  }

  showList(show=true){
    if(show){
      this.list.style.display = 'block'
      this.list.style.opacity = 1
    }else{
      this.list.style.display = 'none'
      this.list.style.opacity = 0
    }
    this.dropdownList.itemIndex = 0
  }


}

export default SearchBox