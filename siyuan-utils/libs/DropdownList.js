/**
 * 弹出列表菜单
 */
class DropdownList {

  constructor(list,itemSelector){
    this.list           = document.querySelector(list)      //列表
    this.itemSelector   = itemSelector  //列表项选择器
    this.itemIndex      = 0   //选择项 index，默认选中第一项
    this.listItems      = null //列表项
  }

  /* 创建列表项 */
  createItems(data){
    let html = '', i=0
    data.forEach(item => {
      i++
      html += `
      <div class="list-item${i==1?' on':''}" data-id="${item.id}" data-title="${item.title}" data-img="${item.pic}" data-author="${item.author_name}" data-url="${item.url}" data-year="${item.year}">
        <div class="img"><img src="${item.pic}" /></div>
        <div class="info">
          <div class="title"><a href="${item.url}">${item.title}</a></div>
          <div class="tips">${item.author_name} - ${item.year}</div>
        </div>
      </div>`
    });
  
    this.list.innerHTML = html
    this.itemIndex = 0
    this.listItems = document.querySelectorAll(this.itemSelector)
  }


  /* 方向键移动菜单项 */
  switchItems(e){
    e.stopPropagation()
    e.preventDefault()
    switch (e.key) {
      case 'ArrowUp': 
        this.up(this.listItems)
        this.scrollList()
        break;
      case 'ArrowDown': 
        this.down(this.listItems)
        this.scrollList()
        break
      case 'Tab':
        this.down(this.listItems)
        this.scrollList()
        break
      default:
        break;
    }
  
  }

  up(listItems){
    if(this.itemIndex == -1){ this.itemIndex = listItems.length - 1}
    else{ 
      listItems[this.itemIndex].classList.remove('on')
      this.itemIndex -=1
      }
    if(this.itemIndex < 0){ this.itemIndex = listItems.length - 1}
    listItems[this.itemIndex].classList.add('on')
  }

  down(listItems){
    if(this.itemIndex == -1){ this.itemIndex = 0}
    else{
      listItems[this.itemIndex].classList.remove('on')
      this.itemIndex++
    }
    if(this.itemIndex >= listItems.length) this.itemIndex = 0
    listItems[this.itemIndex].classList.add('on')
  }

  /* 选中菜单项 */
  selectItem(){
    let items = this.listItems
    if(this.itemIndex != -1){
      return items[this.itemIndex] 
    }
  }
  
  /* 循环滚动列表 */
  scrollList(){
    let index = this.itemIndex ,
        list  = this.list,
        items = this.listItems,
        itemsCount  = items.length ,
        itemHeight  = items[0].scrollHeight ,
        listHeight  = list.clientHeight ,
        listScrollHeight = list.scrollHeight ,
        listScrollTop = list.scrollTop

    if( (index+1) * itemHeight - listScrollTop > listHeight ){
      list.scrollTop += itemHeight
    }
    if( index * itemHeight < listScrollTop){
      list.scrollTop -= itemHeight
    }
    if( index == 0){
      list.scrollTop = 0
    }
    if( index == itemsCount - 1){
      list.scrollTop = listScrollHeight - listHeight
    }
  }


}

export default DropdownList