<template>
    <div class="main">
        <el-form ref="form" :model="form" label-width="auto" >
            <el-form-item label="">
                <el-input id="input" type="textarea" v-model="form.note" placeholder="写点啥不"></el-input>
            </el-form-item>
        </el-form>
        <div style="display:flex;justify-content:space-between">
          <el-button class="save-btn" type="primary" size="medium" round plain @click="saveNote">保存</el-button>
          <el-button title="设置" icon="el-icon-setting" circle @click="openOptions"></el-button>
        </div>
        
    </div>
</template>
<script >
// import HelloPopup from './components/HelloPopup.vue'
import dayjs from 'dayjs'
export default{
  data(){
      return{
          hi:'hello',
          form:{
            note:'',
          }
      }
  },

  methods:{
    async init(){
      
      // 获取用户设置
      chrome.storage.local.get(['setting'], async (result) =>{
        this.setting = result.setting && JSON.stringify(result.setting.user) != '{}' ? result.setting.user : false
        if(this.setting.appendUrlTitle){
          let title = await this.appendUrlTitle() //自动填充网页标题 ur
          this.form.note += title
        }
        if(this.setting.noteTags){
          this.form.note += this.setting.noteTags + ' '
        }
               
        this.input = document.querySelector('#input')
        this.input.focus()
        this.btn = document.querySelector('.save-btn')
        this.baseUrl = this.setting.baseUrl ? this.setting.baseUrl : '127.0.0.1:6806'

        if(!this.setting.noteBox){
          this.showBtnNotice('请先设置笔记本 →','warning',5000)
        }
      });
    },
    // 添加网页标题
    appendUrlTitle(){
      return new Promise((resolve,reject)=>{
        chrome.tabs.query({active: true,currentWindow: true},tabs=>{
        this.pageUrl   = tabs[0].url;
        this.pageTitle = tabs[0].title;
        resolve(`来源：[${this.pageTitle}](${this.pageUrl})\n`)
      })
      })
      
    },
    // 保存 note
    saveNote(){
      // 内容不能为空
      if(!this.form.note){
        this.btn.innerText = "老哥，啥也没写呢"
            this.btn.classList.add('el-button--danger')
            setTimeout(()=>{
              this.btn.innerText = '保存'
              this.btn.classList.remove('el-button--danger')
            },2000)
        return
      }
      // 笔记本设置不能为空
      if(!this.setting.noteBox){
        this.showBtnNotice('请先设置笔记本 →','warning')
        return
      }

      // 设置笔记文档名称
      let defaultTitle = dayjs().format('YYYYMMDD HH:mm:ss') + '.sy'
      switch (this.setting.noteTitleType) {
        case "网页标题":
          this.noteTitle = this.pageTitle + '.sy'
          break;
        case "首行内容":
          let lines = this.form.note.split('\n')
          this.noteTitle = lines[0] ? lines[0] + '.sy' : defaultTitle
          break;
        default:
          this.noteTitle = defaultTitle
          break;
      }

      this.noteFolder = this.setting.noteFolder ? '/' + this.setting.noteFolder +'/' : ''     
      let path = this.noteFolder + this.noteTitle.replace(/[\/|\\|\:|\*|\?|\"|\<|\>|\|]+/g,"-") //替换文档标题中的特殊字符

      let data = {
        "notebook": this.setting.noteBox,
        "path": path,
        "markdown": this.form.note.replace(/\n/g,'\n\n') //Markdown 空行实现硬换行
      }
      
      
      let url = 'http://' + this.baseUrl + '/api/filetree/createDocWithMd'
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data), // "{"name":"Billy","age":18}"
        }).then(res=>{ return res.json()
        }).then(res=>{
          // console.log(res)
          
          if(res.code == 0){
            this.form.note = ''
            this.showBtnNotice('保存成功')
          }else{
            this.showBtnNotice(res.msg,'danger')
          }
          
        }).catch(err=>{
          console.log(err)
          this.showBtnNotice('网络错误','danger')
        })
    },
    showBtnNotice(msg,type='success',time=2000){
      this.btn.innerText = msg
      this.btn.classList.add(`el-button--${type}`)
      setTimeout(() => {
        this.btn.innerText = '保存'
        this.btn.classList.remove(`el-button--${type}`)
      }, time);


    },

    openOptions(){
      window.open(chrome.runtime.getURL('libs_options.html'));
    }
  },

  mounted(){
    this.init()

  }
      
      

}
</script>
<style>
body{
  padding: 0;
  margin: 0;
  background-color: #f8f8f8;
}
.main{
  width:400px;
  margin: 10px;
  /* height:300px; */
  /* padding:10px; */
  
}
.el-textarea__inner{
  height: 150px;
}
.el-form-item{
  margin-bottom: 10px !important;
}
</style>
