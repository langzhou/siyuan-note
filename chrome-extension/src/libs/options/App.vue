<template>
  <div class="options">
    <el-dialog
      title="新增常用属性"
      v-model="dialogVisible"
      width="35%"
      center
      :before-close="handleClose">
      <!-- 表单 -->
      <el-form ref="dialogInputs" :model="dialogInputs" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="dialogInputs.attrName" placeholder="内容输入时用来检索属性" ></el-input>
        </el-form-item>
        <el-form-item label="属性名">
          <el-input v-model="dialogInputs.attrKey" placeholder="请填入属性名" ></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <el-input v-model="dialogInputs.attrValue" placeholder="请填入属性值" ></el-input>
        </el-form-item>
      </el-form>
      <!-- 表单结束 -->
      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="addAttrs()">完 成</el-button>
        </span>
      </template>
    </el-dialog>

    <h3 align="center">💼 思源笔记工具箱</h3>
      <el-form ref="form" :model="form" label-width="100px">
        <div class='title'>基础 <span class="tips">基础设置</span></div>
        <hr>
        <el-row>
          <el-col>
            <el-form-item label="伺服 IP 地址">
              <el-input v-model="form.baseUrl" size="medium"></el-input>
              <div class="tips">默认为 127.0.0.1:6806</div>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="title">主题 <span class="tips">快捷切换常用主题</span></div>
        <hr>
        <el-row>
          <el-col>
            <el-form-item label="亮色主题">
              <el-input v-model="form.lightThemes" size="medium"></el-input>
              <div class="tips">设置亮色主题列表，以 | 作为分割（Toy 主题[如果已安装]无需配置）</div>
            </el-form-item>
            <el-form-item label="暗色主题">
              <el-input v-model="form.darkThemes" size="medium"></el-input>
              <div class="tips">设置暗色主题列表，以 | 作为分割</div>
            </el-form-item>
            <el-form-item label="自定义 CSS">
              <el-input type="textarea" v-model="form.customCss"></el-input>
              <div class="tips">自定义的主题样式</div>          
            </el-form-item>
          </el-col>
        </el-row>
        
        <div class="title">闪念 <span class="tips">点击插件图标记录碎片笔记</span></div>
        <hr>
        <el-row>
          <el-col :span="12">
            <el-form-item label="笔记本">
            <el-input v-model="form.noteBox" size="medium"></el-input>
            <div class="tips">设置闪念保存的笔记本<span style="color:red">（必填）</span></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件夹">
            <el-input v-model="form.noteFolder" size="medium"></el-input>
            <div class="tips">多级文件夹以 / 分隔</div>
            </el-form-item>
          </el-col>
        </el-row>  
        <el-row>
          <el-col>
            <el-form-item label="文档标题">
            <el-radio-group v-model="form.noteTitleType" size="small" @change="showTips">
              <el-radio-button label="当前时间" ></el-radio-button>
              <el-radio-button label="网页标题"></el-radio-button>
              <el-radio-button label="首行内容"></el-radio-button>
            </el-radio-group>
            <div class="tips note-title-type">以当前时间作为文档标题，示例：20210701 12:01:12</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签">
            <el-input v-model="form.noteTags" size="medium"></el-input>
            <div class="tips">以#包裹，示例：#网络文摘#</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网址标题">
              <el-switch v-model="form.appendUrlTitle"></el-switch>
              <div class="tips">自动填充当前网址和页面标题</div>
            </el-form-item>
          </el-col>
        </el-row>
         
        <div class="title">快捷属性输入 <span class="tips">通过@呼出常用属性</span></div>
        <hr>
        <el-row>
          <el-col :span="12">
            <el-form-item label="功能开关">
              <el-switch v-model="form.quickAttrs"></el-switch>
              <div class="tips">开启块属性快捷输入</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保留属性值">
              <el-switch v-model="form.keepAttrs"></el-switch>
              <div class="tips">在内容文本中保留属性值</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button @click="showSettingDialog()" size="small" style="margin-bottom:10px;">新增常用属性</el-button>
          <el-table
            :data="customAttrs"
            border
            style="width: 100%">
            <el-table-column
              label="名称"
              prop="attrName"
              >
            </el-table-column>
            <el-table-column
              label="属性名"
              prop="attrKey">
            </el-table-column>
            <el-table-column
              label="属性值"
              prop="attrValue">
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="justify-content:center;margin-top:20px;">
            <el-button type="primary" @click="onSubmit">保存设置</el-button>
            <!-- <el-button @click="clearSetting">重置</el-button> -->
        </el-row>
      </el-form>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
export default defineComponent({
  data(){
    return{
      dialogVisible: false, //显示设置对话框
      dialogType: 'insert',
      dialogIndex:null,
      dialogInputs:{
        attrName: '',
        attrKey:'',
        attrValue:''
      },
      form: {
        lightThemes: '',
        darkThemes: '',
        noteBox:'',
        noteFolder:'',
        unsplash: false,
        attrsPanel: true,
        autoTheme: false,
        appendUrlTitle:true,
        baseUrl: '127.0.0.1:6806',
        noteTitleType: '当前时间',
        noteTags:'',
        customCss: '',
        quickAttrs: false,
        keepAttrs: false,
        customAttrs: null,
      },
      customAttrs:[{
        attrName:'已完成（示例）',
        attrKey:'todo',
        attrValue:'done'
      }]
    }
  },


  methods: {
    init(){
      // this.customAttrs = []
      chrome.storage.local.get(['setting'], result =>{
        if(JSON.stringify(result) == '{}'){
          console.log("Siyuan Utils:用户设置为空")
        }else{
          this.form = result.setting.user
          this.customAttrs = Object.values(result.setting.user.customAttrs) //将对象转换成数组
          document.querySelector('.note-title-type').innerText = this.getTips(this.form.noteTitleType)
        }
        
      });
    },
      // 弹出设置对话框
    showSettingDialog(){
      this.dialogVisible = true
    },
    // 编辑属性
    handleEdit(index){
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.dialogInputs = this.customAttrs[index]
      this.dialogIndex = index

      
    },
    /* 删除属性 */
    handleDelete(index,row){
      this.customAttrs.splice(index,1)
    },

    /* 增加新的属性 */
    addAttrs(){
      let temp = JSON.parse(JSON.stringify(this.dialogInputs)) //对对象进行深层拷贝，只传值不传址
      if(this.dialogType == 'insert'){
        this.customAttrs.push(temp)
      }else{
        this.dialogType = 'insert'
        this.customAttrs[this.dialogIndex] = temp
      }
      this.dialogVisible = false  
      this.dialogIndex = null
      this.dialogInputs = { attrName: '', attrKey:'', attrValue:'' } // 清空表单
      
    },

    // 提交表单
    onSubmit() {
      this.form.customAttrs = this.customAttrs
      console.log(this.form)
      let data = {user:this.form}
      chrome.storage.local.set({setting: data}, function() {
        ElMessage.success({
          message: '保存成功',
          type: 'success'
        })
      });
    },

    // 展示提示文案
    showTips(value){
      let tips = document.querySelector('.note-title-type')
      tips.innerText = this.getTips(value)
    },
      

    // 获取提示文案
    getTips(type){
      let tips = ''
      switch (type) {
        case '网页标题':
          tips = '以网页标题作为文档标题'
          break;
        case '首行内容':
          tips = '以首行内容作为文档标题，特殊字符/\:*?"<>|将会过滤'
          break;
        default:
          tips = '以当前时间作为文档标题，示例：20210701 12:01:12'
          break;
      }
      return tips
    }



     
    },
  mounted(){
    this.init()
  },  
  watch:{
    form(){
      // console.log("form is changing")
    }
  }
})
</script>
<style>
html,body,#app{
  margin: 0;
  padding: 0;
  background-color: #EEE;
  font-size: 16px;
}
hr{
  height: 1px;
  border: none;
  background-color: #efefef;
  margin: 0px 0 30px 0;
}
.title{
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0;
}
#app{
  display: flex;
  justify-content: center;
}
.options{
  max-width: 800px;
  min-width: 600px;
  border-radius: 6px;
  padding:10px 40px;
  margin:20px 0;
  background-color: white;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
}
.options .tips{
  font-size: 13px;
  color: #999;
  margin:5px 0;
  line-height: 1.4em;
  
}
.title .tips{
  font-weight: normal !important;
  font-size: 14px !important;
}
.el-form-item{
  margin-bottom: 12px;
}
</style>
