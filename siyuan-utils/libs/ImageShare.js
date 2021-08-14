/* 选择文本后以图片形式进行分享 */
import html2canvas from 'html2canvas'
class ImageShare{
  constructor(){
    this.box        = null
    this.container  = null
    this.image      = null
  }

  showBox(){
    if(!this.box) this.createBox()
    this.createImage()
    this.overlay.style.display = 'block'
    this.box.style.display = 'block'
  }

  hiddenBox(){
    if(this.box){
      this.box.style.display = 'none'
      this.boxBody.innerHTML = ''
    }
    if(this.overlay){
      this.overlay.style.display = 'none'
    }
  }

  createBox(){
    let fragment = document.createDocumentFragment()
    this.box = document.createElement('div')
    this.box.id = 'lz-image-box'
    let header = document.createElement('div')
    header.className = 'header'
    header.innerHTML = `
      <div style="display:flex">
        <div class="title">分享图片</div>
        <div class="btn-group">
          <div class="theme white"></div>
          <div class="theme black"></div>
          <div class="theme yellow"></div>
        </div>
      </div>
      <div class="save">保存</div>
    `
    header.addEventListener('click',e=>this.handleEvents(e))
    this.boxBody = document.createElement('div')
    this.boxBody.className = 'image'
    this.box.appendChild(header)
    this.box.appendChild(this.boxBody)
    fragment.appendChild(this.box)
    let overlay = document.querySelector('.lz-overlay-black')
    if(overlay){
      this.overlay = overlay
    }else{
      this.overlay = document.createElement('div')
      this.overlay.className = 'lz-overlay-black'
      fragment.appendChild(this.overlay)
    }
    this.overlay.addEventListener('click',()=>this.hiddenBox())
    this.container = document.createElement('div')
    this.container.id = 'lz-image-container'
    fragment.appendChild(this.container)
    document.body.appendChild(fragment)
  }

  handleEvents(e){
    let target = e.target
    if(target.classList.contains('save')){
      this.download()
    }
  }

  createImage(){
    this.createImgContainer()
    html2canvas(this.container).then(canvas =>{
      this.img = this.canvasToImage(canvas)
      this.boxBody.appendChild(this.img)
    })
  }

  createImgContainer(){
    let blocks = document.querySelectorAll('.protyle-wysiwyg--select')
    let html = ''
    if(blocks.length > 0){
      console.log(blocks);
      blocks.forEach((item,index,node)=>{
        html += `<p>${item.innerText}</p>`
      })
    }else{
      let selection = getSelection()
      let range = selection.getRangeAt(0)
      if(range.toString()){
        html += `<p>${range.toString()}</p>`
      }
    }
    this.container.innerHTML = html
  }

  canvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
  }

  download(){
    if(this.img){
      let url = this.img.src
      let a = document.createElement('a')
      let event = new MouseEvent('click')
      a.download =  '思源笔记分享'
      a.href = url
      a.dispatchEvent(event)
    }
  }
}

export default ImageShare