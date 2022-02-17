import { Snackbar } from "./common"
class toolbar{

  constructor(options){
    this.init(options)
  }

  async init(options){
    this.setting = options
    this.hasToy  = await this.hasToyTheme()
    this.createToolbar()
  }

  /* 判断用户是否安装了 toy 主题 */
  hasToyTheme(){
    const url = this.setting.baseUrl + '/appearance/themes/toy/theme.css'
    return new Promise((resolve, reject) => {
      fetch(url).then(res => {
          if(res.status == 200){
            resolve(true)
          }else{
            console.log('未安装 Toy 主题，err：'+res.status);
            resolve(false)
          }
        }).catch(error=>reject(error))
    })
  }

  /* 
  ** 更改主题 
  ** @param {string} theme 主题名称
  ** @param {string} type - daylight | midnight
  ** @param {string} mode - common：通用 | toy：针对 toy 特殊处理
  **/
  changeTheme(theme,type,mode='common') {
    this.themeDefaultStyle = document.querySelector('#themeDefaultStyle')
    this.themeStyle        = document.querySelector('#themeStyle')
    // 默认主题
    if(type == 'daylight'){
      this.themeDefaultStyle.href = this.themeDefaultStyle.href.replace(/themes\/(\S+)\/theme\.css/g, `themes/daylight/theme.css`)
    }else{
      this.themeDefaultStyle.href = this.themeDefaultStyle.href.replace(/themes\/(\S+)\/theme\.css/g, `themes/midnight/theme.css`)
    }
    let toyTheme = document.querySelector('#toy-theme')
    switch (mode) {
      case 'toy':
        //toy 主题要特殊处理
        this.themeStyle.href = this.themeStyle.href.replace(/themes\/(\S+)\/theme\.css/g, `themes/${type}/theme.css`) //用默认主题占位
        let css = `@import url("${this.setting.baseUrl}/appearance/themes/toy/palette/${theme}.css");@import url("${this.setting.baseUrl}/appearance/themes/toy/base.css");`
        
        if(toyTheme){
          toyTheme.innerText = css
        }else{
          toyTheme = document.createElement('style')
          toyTheme.id = 'toy-theme'
          toyTheme.innerText = css
          let customCss = document.querySelector('#custom-css')
          if(customCss){
            // 如果有自定义 css，则需要在自定义样式之前插入
            document.head.insertBefore(toyTheme,customCss)
          }else{
            document.head.appendChild(toyTheme)
          }
        }
        break;
    
      default:
        if(toyTheme){toyTheme.innerText = ''}
        this.themeStyle.href = this.themeStyle.href.replace(/themes\/(\S+)\/theme\.css/g, `themes/${theme}/theme.css`)
        break;
    }
  }

  /** 
  * 创建 toolbar
  */
  createToolbar() {
    // 添加工具条
    this.toolbar    = document.createElement('div')
    this.toolbar.id = 'lz-toolbar'
    this.toolbar.classList.add('close')
    document.body.appendChild(this.toolbar)

    // 添加工具条按钮项
    let themeBtn    = document.createElement('i')
    themeBtn.title  = '切换主题'
    themeBtn.id     = 'btn-theme'
    themeBtn.classList.add("toolbar-btn","el-icon-brush")

    let actionBtn   = document.createElement('i')
    actionBtn.title = '功能菜单'
    actionBtn.id    = 'btn-action'
    actionBtn.classList.add("toolbar-btn","el-icon-suitcase")

    let setBtn      = document.createElement('i')
    setBtn.title    = '设置'
    setBtn.id       = 'btn-set'
    setBtn.classList.add("toolbar-btn","el-icon-set-up")
    
    let closeBtn    = document.createElement('i')
    closeBtn.id     = 'btn-close'
    closeBtn.classList.add("toolbar-btn","closeBtn","el-icon-d-arrow-right")

    // 关闭按钮点击事件
    closeBtn.addEventListener('click',()=>{
      let isClose = this.toolbar.classList.contains('close')
      if(isClose){
        closeBtn.classList.remove("el-icon-d-arrow-left")
        closeBtn.classList.add("el-icon-d-arrow-right")
        this.toolbar.classList.remove('close')
      }else{
        closeBtn.classList.remove("el-icon-d-arrow-right")
        closeBtn.classList.add("el-icon-d-arrow-left")
        this.toolbar.classList.add('close')
      }
    })

    this.toolbar.appendChild(themeBtn)
    // this.toolbar.appendChild(actionBtn)
    this.toolbar.appendChild(setBtn)
    this.toolbar.appendChild(closeBtn)
    
    /* 增加菜单：切换主题 */
    this.themeMenu    = document.createElement('div')
    this.themeMenu.id = 'menu-theme'
    this.themeMenu.classList.add('menu')

    // 针对 toy 主题做特殊处理
    if(this.hasToy){
      let toyThemes   = document.createElement('div')
      toyThemes.id    = 'theme-toy-default'
      toyThemes.innerHTML = 'Toy 🛺  <i class="el-icon-arrow-right"></i>'
      toyThemes.classList.add('menu-item')
      this.themeMenu.appendChild(toyThemes)
      // 添加二级菜单
      let toySubMenu  = document.createElement('div')
      toySubMenu.id   = 'theme-toy-submenu'
      toySubMenu.classList.add('submenu')
      this.themeMenu.appendChild(toySubMenu)

      // 添加配色列表至二级菜单
      let palettes = this.setting.config.toyThemesList
      if(palettes){
        for (let i = 0; i < palettes.length; i++) {
          const theme    = palettes[i];
          let item       = document.createElement('div')
          item.id        = `theme-toy-${theme.value}`
          item.innerText = theme.name
          item.classList.add('menu-item')
          item.addEventListener('click',()=>{ this.changeTheme(theme.value,theme.type,'toy') }, false)
          toySubMenu.appendChild(item)
        }
      }

      // 二级菜单鼠标事件
      toySubMenu.addEventListener('mouseout',(e)=>{
        // 阻止事件冒泡
        e.stopPropagation()
        e.cancelBubble = true
        // 如果鼠标不是移到 toy 主题相关的菜单项，则关闭二级菜单
        if(!(e.toElement.id && e.toElement.id.indexOf('theme-toy') > -1)){
          this.closeMenus('self','submenu','theme-toy-submenu')
        }
      })

      toySubMenu.addEventListener('mouseover',(e)=>{
        e.stopPropagation()
        e.cancelBubble = true
      })

      // toy 主题一级菜单事件
      toyThemes.addEventListener('mouseover',(e)=>{
        e.stopPropagation()
        e.cancelBubble = true
        toySubMenu.classList.add('show')
        // 计算二级菜单展现的坐标位置
        let x = e.toElement.parentElement.offsetLeft //toy一级菜单项的坐标
        let y = e.toElement.parentElement.offsetTop
        let h = toySubMenu.clientHeight
        let w = toySubMenu.clientWidth
        toySubMenu.style.right = (document.documentElement.clientWidth - x + 5) + 'px' 
        if( y + h > document.body.clientHeight){
          toySubMenu.style.top = (document.documentElement.clientHeight - h - 5) + 'px'
        }else{
          toySubMenu.style.top = y + 'px'
        } 
        
      })

      toyThemes.addEventListener('mouseout',(e)=>{
        if(e.offsetX > 0 && (e.toElement.id.indexOf('theme-toy' || !e.toElement.id)) == -1){
          toySubMenu.classList.remove('show')
        }
      })

    }

    /* 添加用户设置的主题列表 */
    let lightThemes = this.setting.user.lightThemes
    let darkThemes  = this.setting.user.darkThemes
    if(lightThemes){
      lightThemes = lightThemes.split('|')
      for (let i = 0; i < lightThemes.length; i++) {
        const theme = lightThemes[i].replace(/(^\s*)|(\s*$)/g, "") //去除空格
        if(theme){
          let item       = document.createElement('div')
          item.id        = `theme-${theme}`
          item.innerText = theme
          item.classList.add('menu-item')
          item.addEventListener('click',()=>{ this.changeTheme(theme,'daylight') }, false)
          this.themeMenu.appendChild(item)
        }
      }
    }

    if(darkThemes){
      darkThemes  = darkThemes.split('|')
      for (let i = 0; i < darkThemes.length; i++) {
        const theme = darkThemes[i].replace(/(^\s*)|(\s*$)/g, "")
        if(theme){
          let item       = document.createElement('div')
          item.id        = `theme-${theme}`
          item.innerText = theme
          item.classList.add('menu-item')
          item.addEventListener('click',()=>{ this.changeTheme(theme,'midnight') }, false)
          this.themeMenu.appendChild(item)
        }
      }
    }
    
    this.toolbar.appendChild(this.themeMenu)


    /* 增加菜单：操作 */
    this.actionMenu     = document.createElement('div')
    this.actionMenu.id  = 'menu-action'
    this.actionMenu.classList.add('menu')
    this.toolbar.appendChild(this.actionMenu)

    /* 增加菜单项：随机漫步 */
    this.randomWalkBtn = document.createElement('div')
    this.randomWalkBtn.id = 'random-walk'
    this.randomWalkBtn.innerText = '随机漫步'
    this.randomWalkBtn.classList.add('menu-item')
    this.actionMenu.appendChild(this.randomWalkBtn)

    /* 增加菜单项：文档属性面板 */
    this.attrsPanelBtn = document.createElement('div')
    this.attrsPanelBtn.id = 'attrs-panel'
    this.attrsPanelBtn.innerText = '属性面板'
    this.attrsPanelBtn.classList.add('menu-item')
    this.actionMenu.appendChild(this.attrsPanelBtn)

    /* 增加菜单：设置 */
    this.setMenu    = document.createElement('div')
    this.setMenu.id = 'menu-set'
    this.setMenu.classList.add('menu')
    this.toolbar.appendChild(this.setMenu)

    /* 增加菜单项：配置 */
    this.optionsBtn    = document.createElement('div')
    this.optionsBtn.id = 'options-btn'
    this.optionsBtn.innerText = '插件配置'
    this.optionsBtn.classList.add('menu-item')
    this.setMenu.appendChild(this.optionsBtn)
    this.optionsBtn.addEventListener('click',()=>{
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('libs_options.html'));
      }

      /* chrome.storage.local.clear(()=>{
        console.log('缓存清除成功')
      }) */
    })
    /* 增加菜单项：清空配置 */
    this.clearOptionsBtn    = document.createElement('div')
    this.clearOptionsBtn.id = 'clear-btn'
    this.clearOptionsBtn.innerText = '清空配置'
    this.clearOptionsBtn.classList.add('menu-item')
    this.setMenu.appendChild(this.clearOptionsBtn)
    this.clearOptionsBtn.addEventListener('click',()=>{
      chrome.storage.local.clear(()=>{
        Snackbar('配置已清空')
      })
    })


    // 绑定 toolbar-btn 菜单按钮点击事件
    let toolbarItems = document.querySelectorAll('#lz-toolbar .toolbar-btn')
    toolbarItems.forEach((item,i,obj)=>{
      if(item.id){
        // 通过 id 匹配 class 获得按钮对应的菜单
        // let menu = document.querySelector('#lz-toolbar #' + item.id.replace('btn','menu'))
        item.addEventListener('click',(e)=>{
          let isShow = item.classList.contains('show')
          if(isShow){
            item.classList.remove('show') // 移除按钮 show 样式
            this.closeMenus('self','btn',item.id) //关闭按钮对应的菜单
          }else{
            this.closeMenus('others','btn',item.id) //关闭其他菜单
            let id   = item.id.replace('btn','menu')
            let menu = document.querySelector(`#lz-toolbar #${id}`)
            if(menu){
              let left = e.clientX - 50 //鼠标点击位置左移 30px
              if( left + 180 >= document.documentElement.clientWidth){
                menu.style.right = '60px'
              }else{
                menu.style.left = left + 'px'
              }
              menu.classList.add('show') // 显示菜单
              item.classList.add('show')
              this.menuMask.style.display = 'block'
            }
            
          }
        })
      }
    })

    // menu-item 菜单项点击关闭菜单
    let menuItems = document.querySelectorAll('#lz-toolbar .menu-item')
    menuItems.forEach((item,i,obj)=>{
        item.addEventListener('click',(e)=>{
          let el = document.querySelectorAll('#lz-toolbar .show') //直接关闭全部带有 show 样式的元素（省事）
          el.forEach((element,j,obj2)=>{
            element.classList.remove('show')
          })
        })
    })

    // 菜单遮罩，点击时关闭菜单
    this.menuMask = document.createElement('div')
    this.menuMask.classList.add('menu-mask')
    document.body.appendChild(this.menuMask)
    this.menuMask.addEventListener('click',()=>{
      this.closeMenus()
      this.menuMask.style.display = 'none'
    })

  }

  /* 关闭弹出菜单 
  * @param {string} mode - 模式：self | others | all
  * @param {string} itemType -  类型：btn 功能按钮 | menu-item 菜单子项 | submenu 二级菜单
  */
  closeMenus(mode,itemType,itemId){
    let menu,menuId 
    switch (mode) {
      case 'self':
        // 关闭自身
        if(!itemType || !itemId){return false} //必须要传入类型和 id 才能判断
        
        if(itemType == 'btn'){
          // 如果是按钮点击，需要找到对应的菜单
          menuId = itemId.replace('btn','menu')
        }
        if(itemType == 'menu-item'){
          // 如果是菜单项点击，则需要找到其上级菜单
          menuId = document.querySelector(`#${itemId}`).parentNode.id
        }
        if(itemType == 'submenu'){
          // 如果是二级菜单点击，则直接关闭自身（因为二级菜单项也是用的 menu-item，所以无法用来关闭菜单）
          menuId = itemId
        }

        menu = document.querySelector(`#lz-toolbar #${menuId}`)
        menu.classList.remove('show')
        break;

      case 'others':
        // 关闭其他菜单
        if(!itemType || !itemId){return false}
        let otherBtns, otherMenus
        if(itemType == 'btn'){
          menuId = itemId.replace('btn','menu')
        }
        if(itemType == 'menu-item'){
          menuId = document.querySelector(`#${itemId}`).parentNode.id
        }
        // 遍历依次移除其他按钮的点击效果
        otherBtns = document.querySelectorAll(`#lz-toolbar :not(#${menuId}).toolbar-btn`)
        otherBtns.forEach((item,i,obj)=>{
          item.classList.remove('show')
        })

        // 遍历依次关闭其他菜单
        otherMenus = document.querySelectorAll(`#lz-toolbar :not(#${menuId}).menu`)
        otherMenus.forEach((item,i,obj)=>{
          item.classList.remove('show')
        })
        
        break;

      default:
        // 不传参则关闭所有菜单
        let allMenus = document.querySelectorAll('#lz-toolbar .menu')
        allMenus.forEach((item,i,obj)=>{
          item.classList.remove('show')
        })
        let allBtns = document.querySelectorAll('#lz-toolbar .toolbar-btn')
        allBtns.forEach((item,i,obj)=>{
          item.classList.remove('show')
        })
        break;
    } 
  }

}

export default toolbar