class drag{
  /* 构造函数
  ** @param {node} element - 要拖动的元素
  ** @param {function} movefn - 移动中回调方法
  ** @param {function} endfn - 移动结束后回调方法
   */
  constructor(element,movefn,endfn){
    // console.log(element)
    if(!element){
      throw '拖拽对象为空'
    }else{
      this.el = element
    }
    this.mx = null
    this.my = null
    this.ox = null
    this.oy = null 
    this.movefn = movefn
    this.endfn  = endfn
  }

  // 初始化，完成事件注册
  init(){
    this.el.onmousedown = (event)=>{
      event = this.e(event)
      this.o = event.target
      this.ox = parseInt(this.o.offsetLeft);  // 拖放元素的x轴坐标
      this.oy = parseInt(this.o.offsetTop);  // 拖放元素的y轴坐标
      this.mx = event.mx;  // 按下鼠标指针的x轴坐标
      this.my = event.my;  // 按下鼠标指针的y轴坐标
      this.el.onmousemove = (event)=>this.move(event,this);  // 注册鼠标移动事件处理函数
      this.el.onmouseup = (event)=>this.stop(event,this);  // 注册松开鼠标事件处理函数
    }
  }

  // 定义事件对象标准化函数
  e(event){  
    if( ! event){  // 兼容IE浏览器
        event = window.event;
        event.target = event.srcElement;
        event.layerX = event.offsetX;
        event.layerY = event.offsetY;
    }
    event.mx = event.pageX || event.clientX + document.body.scrollLeft;
    // 计算鼠标指针的x轴距离
    event.my = event.pageY || event.clientY + document.body.scrollTop;
    // 计算鼠标指针的y轴距离
    return event;  // 返回标准化的事件对象
  }

  move(event,self){
    event = self.e(event)
    // 回调函数，self.mx 拖动前横坐标, event.mx 当前横坐标
    this.movefn(self.mx,event.mx,self.my,event.my)    
  }

  stop(event,self){
    event = self.e(event)
    self.ox = parseInt(self.o.offsetLeft);  // 记录拖放元素的x轴坐标
    self.oy = parseInt(self.o.offsetTop);  // 记录拖放元素的y轴坐标
    self.mx = event.mx ;  // 记录鼠标指针的x轴坐标
    self.my = event.my ;  // 记录鼠标指针的y轴坐标
    this.endfn(self.mx,self.my) //返回最终鼠标所在坐标
    self.onmousedown = self.el.onmousemove = self.el.onmouseup = null;
  }
  
  end(){
    this.el = this.el.onmousedown = null
  }

}

export default drag