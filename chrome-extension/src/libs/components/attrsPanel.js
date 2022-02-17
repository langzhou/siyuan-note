class attrsPanel{

  constructor(options){
    this.init()
  }

  async init(options){
    this.createAttrsPanel()

  }

  /* 获取块 id */
  getBlockId(){
    // 解析面包屑获取 ID
    let blockId = document.querySelector('.protyle-breadcrumb__bar > .protyle-breadcrumb__item:first-child').getAttribute('data-node-id')
    
    return blockId ? blockId : false

  }

  /* 获取属性 */
  getAttrs(id){

  }

  /* 创建属性面板 */
  createAttrsPanel() {
    const html = `
  <div data-type="wnd" class="fn__flex-column fn__flex fn__flex-1"> 
    <div class="layout-tab-container fn__flex-1">
        <div style="padding:10px;">
        <div class="block__icons">
        <div class="block__logo">
            <svg><use xlink:href="#iconLink"></use></svg>
            文档属性
        </div>
      </div>
          <div>创建：7 月 12 日</div>
          <div>更新：7 月 12 日</div>
          <div>待办：@inbox</div>
          <div>优先级：@P1</div>
        </div>
    </div> 
  </div>
  `
    const panel = document.querySelector('#layouts > .fn__flex.fn__flex-1 > .fn__flex-column:last-child');
    // console.log(panel)
    const div = document.createElement('div')
    div.innerHTML = html
    panel.insertBefore(div,panel.childNodes[0])
  }
}