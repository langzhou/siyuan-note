import drag from "./drag"
class dragCover {
  constructor(setting){
    this.setting = setting
    this.element = null
    // this.moving  = false //当前是否处于调整模式
    setTimeout(()=>{ this.initDrag()},3000) // 延迟加载，避免元素未完全载入    
  }
  /* 获得首次打开所有标签页的题头图 */
  initDrag(){
    const protyles = document.querySelectorAll('.layout__center.fn__flex.fn__flex-1 .protyle')
    protyles.forEach((protyle,i,obj)=>{
      this.creatBtn(protyle)
    })
  }  

  /* 添加拖动调整按钮 */
  creatBtn(protyle){
    let dragHandle
    let documentId = protyle.querySelector('.protyle-breadcrumb__bar > .protyle-breadcrumb__item:first-child')
    documentId = documentId.getAttribute('data-node-id')
    let protyleIcons    = protyle.querySelector('.protyle-background .protyle-icons')
    let backgroundImage = protyleIcons.parentNode

    if(!documentId || !protyleIcons){
      setTimeout(()=>this.creatBtn(),400)
    }else{
      let moveBtn = document.createElement('span')
      moveBtn.classList.add('b3-tooltips','b3-tooltips__s')
      moveBtn.setAttribute('data-action','move')
      moveBtn.setAttribute('aria-label','调整位置')
      moveBtn.innerHTML = `<svg class="svg"><use xlink:href="#iconMove"></use></svg>`
      protyleIcons.appendChild(moveBtn)

      //取消、确定按钮
      let confirmBtn = document.createElement('span')
      confirmBtn.classList.add('drag-cover-btn')
      confirmBtn.setAttribute('aria-label','完成头图调整')
      confirmBtn.innerText = '保存'
      confirmBtn.style.opacity = 0
      confirmBtn.style.display = 'none'
      protyleIcons.appendChild(confirmBtn)

      let cancleBtn = document.createElement('span')
      cancleBtn.classList.add('drag-cover-btn')
      cancleBtn.setAttribute('aria-label','取消头图调整')
      cancleBtn.innerText = '取消'
      cancleBtn.style.opacity = 0
      cancleBtn.style.display = 'none'
      protyleIcons.appendChild(cancleBtn)

      //绑定按钮事件
      moveBtn.addEventListener('click',()=>{
        
        if(backgroundImage.style.backgroundImage.indexOf('url') == -1){
          alert('无头图或官方头图不支持拖动')
          return
        }
     
        dragHandle = new drag(backgroundImage,(a,b,c,d)=>this.moveHandle(a,b,c,d,backgroundImage),(a,b)=>this.endHandle(a,b))
        dragHandle.init() //头图点击实现初始化
        this.showMoveBtns(true,backgroundImage)
        
      })

      confirmBtn.addEventListener('mousedown',(e)=>{
        e.stopPropagation()
      })
      cancleBtn.addEventListener('mousedown',(e)=>{
        e.stopPropagation()
      })
      
      confirmBtn.addEventListener('click',(e)=>{
        e.stopPropagation()
        console.log(dragHandle)
        console.log('保存头图')
        dragHandle.end()
        dragHandle = null
        this.showMoveBtns(false,backgroundImage)
        this.saveCoverPosition(backgroundImage,documentId)
      })

      cancleBtn.addEventListener('click',(e)=>{
        e.stopPropagation()
        console.log('取消保存头图')
        dragHandle.end()
        dragHandle = null
        this.showMoveBtns(false,backgroundImage)
      })

    }   
  }  
    
 
  /* 处理头图拖动事件 */
  moveHandle(selfMx,eventMx,selfMy,eventMy,backgroundImage){
    let current = backgroundImage.style.backgroundPositionY 
      current = current.indexOf('%') > -1 ? parseFloat(current.replace('%','')) : 50 
      let left = (selfMx - eventMx) / backgroundImage.clientWidth * 100 + 50
      left = left.toFixed(2) + "%"
      let top = (selfMy - eventMy) / backgroundImage.clientHeight * 100 + current
      top = top > 100 ? 100 : top
      top = top < 0 ? 0 : top
      top = top.toFixed(2) + "%"
      backgroundImage.style.backgroundPosition = `50% ${top}`
  }

  /* 处理头图拖动结束事件 */
  endHandle(selfMx,selfMy){
    //do nothing
  }

  showMoveBtns(show,backgroundImage){
    if(show){
      // 显示按钮
      let icons = backgroundImage.querySelectorAll('.b3-tooltips.b3-tooltips__s')
      icons.forEach((item,i,obj)=>{
        item.style.opacity = 0
        item.style.display = 'none'
      })
      let icons2 = backgroundImage.querySelectorAll('.protyle-background .drag-cover-btn')
      icons2.forEach((item,i,obj)=>{
        item.style.opacity = 1
        item.style.display = 'block'
      })
    }else{
      // 隐藏按钮
      let icons = backgroundImage.querySelectorAll('.protyle-background .drag-cover-btn')
      icons.forEach((item,i,obj)=>{
        item.style.opacity = 0
        item.style.display = 'none'
      })
      let icons2 = backgroundImage.querySelectorAll('.b3-tooltips.b3-tooltips__s')
      icons2.forEach((item,i,obj)=>{
        item.style.opacity = 1
        item.style.display = 'block'
      })
    }
  }

  saveCoverPosition(backgroundImage, documentId){
    let style = backgroundImage.getAttribute('style') //取得当前头图style用于替换  
    let newPosition = backgroundImage.style.backgroundPosition
    style = style.replace(/background\-position*;/,`background-position:${newPosition}`)
    style = style.replace(/"/g,"'")

      const data = { 'id':documentId, 'attrs':{'title-img': style} };
      fetch(this.setting.baseUrl + '/api/attr/setBlockAttrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data), // "{"name":"Billy","age":18}"
        }).then(res=>{ return res.json()
        }).then(res=>{
          // console.log(res)
        })

    
  }
   
}

export default dragCover