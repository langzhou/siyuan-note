<template>
<div id="little-things" :class="viewType" v-loading="loading" element-loading-text="拼命加载中">
  <!-- 设置弹框 -->
  <div class="setting">
    <el-dialog
      title="🍑 Little Things 设置"
      v-model="dialogVisible"
      width="35%"
      center
      :before-close="handleClose">
      <!-- 表单 -->
      <el-form ref="setting" :model="setting" label-width="100px">
        <el-form-item label="自动刷新">
          <el-select v-model="setting.refreshAlways" placeholder="是否自动刷新" >
            <el-option label="自动刷新" value="yes"></el-option>
            <el-option label="手动刷新" value="no"></el-option>
          </el-select>
          
        </el-form-item>
         <el-form-item label="内容显示">
          <el-select v-model="setting.rawContent" placeholder="显示@日期和@todo">
            <el-option label="显示" value="yes"></el-option>
            <el-option label="不显示" value="no"></el-option>
          </el-select>
          <div style="color:#999">是否显示内容中的@日期和@todo</div>
         </el-form-item>
      </el-form>
      <!-- 表单结束 -->
      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="dialogVisible = false">完 成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- 顶栏 topbar -->
  <div id="top-bar">
    <div class="left-col logo">
      <div class="logo-name">Little Things</div>
      <div class="btn-group">
        <icon-refresh theme="outline" size="18" class="btn" title="刷新" @click="getData('reload')"/>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <icon-application-menu theme="outline" size="18" class="btn" title="视图切换" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="el-icon-tickets" @click="changeViewType('list-view')">待办事项</el-dropdown-item>
              <el-dropdown-item icon="el-icon-date" @click="changeViewType('report')">统计报告（todo）</el-dropdown-item>
              <el-dropdown-item icon="el-icon-setting" @click="showSettingDialog()">设置</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="right-col top-actions">
      <div class="notes-count">{{pageName}}</div>
      <div class="btn-group">
        <icon-view-grid-card v-if="showCard" theme="outline" size="18" class="btn" @click="switchToCard(false)" />
        <icon-view-grid-list v-else theme="outline" size="18" class="btn" @click="switchToCard(true)" />
        
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <icon-sort-two theme="outline" size="18" class="btn" title="排序" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item @click="changeOrderBy('custom')" :disabled="listGroup == 'todo' || listGroup == 'priority' ?false:true"><icon-sort-two theme="outline" size="16" class="icon" title="排序" /><span>自定义排序</span></el-dropdown-item> -->
              <el-dropdown-item icon="el-icon-wind-power" @click="changeOrderBy('priority')">按优先级排序</el-dropdown-item>
              <el-dropdown-item icon="el-icon-date" @click="changeOrderBy('updated_stamp')">按更新时间排序</el-dropdown-item>
              <el-dropdown-item icon="el-icon-date" @click="changeOrderBy('created_stamp')">按创建时间排序</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <icon-check-correct theme="outline" size="18" class="btn"  title="显示已完成"/> -->
      </div>
    </div>
  </div>

    <component :is="viewType" :compData="compData" id="main-content" :class="viewType + '-comp'"  :counts="counts"></component>

</div>
</template>

<script>
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { Database } from './utils/database'
import { setAttrs,getRemoteData, queryData } from './utils/request'
import { getUrlParam } from './utils/tools'
import DateUtil from './utils/date'
import ListView from './components/ListView.vue'
import Report from './components/Report.vue'

export default defineComponent({
  name: 'App',
  components: {
    ListView,
    Report,
  },
  computed:{
    pageName(){
      if(this.viewType == 'list-view'){
        return this.listName.toUpperCase() +': ' + this.counts[this.listName] + ' Notes'
      }else if(this.viewType == 'report'){
        return '报告'
      }else{
        return 'Todo'
      }
    }
  },
  data(){
    return{
      blockId:'',
      widgetSetting:{},
      compData:[],
      counts:{},
      loading: false,
      viewType:'list-view',
      listName: 'all',
      listGroup: 'all',
      showCard:false,
      dialogVisible: false, //显示设置对话框
      where: 'all',
      order: 'updated_stamp',
      setting:{
        refreshAlways: 'no',
        rawContent:'no',
      },
    }
  },

  methods:{
    /* 挂件初始化 */
    async initWidget(){   
      await this.getWidgetSetting()   
      await this.getData('reload')
    },

    /* 获取挂件设置 */
    async getWidgetSetting(){
      const block_id = getUrlParam("blockid")
      if(block_id){
        this.blockId = block_id
      } else{
        ElMessage.error("请在URL中配置块ID（blockid=XXX）")
        throw "url 中未配置 blockid 信息"
      }
      const sql = "SELECT b.id AS id, b.box AS box, b.type AS type, b.path AS path, a.name AS attrName, a.value AS attrValue FROM blocks AS b LEFT JOIN attributes AS a ON b.id = a.block_id WHERE b.id = '" + this.blockId + "'"
      let result = await queryData(sql)
      if(result.length == 0){throw "未查询到对应的块内容 BlockId:"+this.blockId}
      
      // this.attributes = result
      // this.noteBox = result[0].box
      
      // 获取文件夹路径
      let path = result[0].path.split("/")
      path.pop()
      path = path.join("/") + "/"
      this.widgetSetting.folderPath = path

      // 遍历获取块属性设置
      console.log("获取用户之前保存的设置：")
      result.forEach(data => {
        let attrName = data.attrName;

        if(attrName == "custom-lz-order-type"){
            this.widgetSetting.orderType = data.attrValue
            console.log(" * ordertype："+ this.orderType)
          }  

      })

    },

    /* 查询本地数据 */
    async getData(reload='no'){
      this.loading = true
      let path  = this.widgetSetting.folderPath ? this.widgetSetting.folderPath : ''
      if(reload == 'reload'){await this.getRemote(path)}

      let data = await this.db.getTodos(this.where,this.order)
      this.compData = data
      
      if(reload == 'reload'){await this.getCounts()}
      this.loading = false
    },

    /* 获取远程数据并存储到本地 */
    async getRemote(path){
      let data = await getRemoteData(path)
      if(!data){  
        ElMessage.warning('文档内未检索到待办事项')
        return false
      }

      this.db.todos.clear() //先清空之前的本地数据
      
      for (let i = 0; i < data.length; i++) {
        const block = data[i]
        const created_stamp = this.date.strToTimeStamp(block.created)
        const updated_stamp = this.date.strToTimeStamp(block.updated)

        let block_data = {
            block_id:       block.id,
            box:            block.box,
            folder:         this.parseFolderName(block.path),
            doc:            this.parseFileName(block.path).replace('.sy',''),
            type:           block.type,
            created:        this.date.formatDate(created_stamp),
            created_stamp:  created_stamp,
            updated:        this.date.formatDate(updated_stamp),
            updated_stamp:  updated_stamp,
        }

        /* 正文中的日期匹配 */
        let reg = /#?@([1-9]\d{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1]))#?/;
        let regResult      = reg.exec(block.content) //找到符合日期格式要求的内容块
        block_data.raw_content  = block.content
        block_data.pure_content = block.content.replace(reg,"").replace('@todo','')// 去除内容中的@日期和@todo    

        if(regResult){
          let due = regResult[1] //获取到匹配的日期
          due = due.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") //统一转换成 yyyy-mm-dd 格式
          let due_stamp = new Date(due).getTime()
          block_data.due = due
          block_data.due_stamp = due_stamp
        }

        // 待办事项
        if(block.attr_name == "custom-lz-todo" && block.attr_value){
           block_data.todo = block.attr_value
        }else{
          block_data.todo = 'null'
        }
        // 待办事项index
        if(block.attr_name == "custom-lz-todo-index"){
          block_data.todo_index = parseInt(block.attr_value)
        }else{
          block_data.todo_index = 999
        }
        // 优先级
        if(block.attr_name == "custom-lz-priority"){
          block_data.priority = block.attr_value
        }else{
          block_data.priority = 'null'
        }
        // 优先级 index
        if(block.attr_name == "custom-lz-priority-index"){
          block_data.priority_index = parseInt(block.attr_value)
        }else{
          block_data.priority_index = 999
        }
        // 匹配正文中的 @todo
        if(block.content.search("@todo") != -1 && block_data.todo == 'null'){
          block_data.todo = 'inbox'
        }
        // 写入到本地数据库
        await this.saveToLocal(block_data)
        }
    },

    async getCounts(){
      let obj   = {} ,
          lists = ['all','inbox','doing','done','someday','today','tomorrow','week','month','P0','P1','P2','P3']
      for (let i = 0; i < lists.length; i++) {
        const item = lists[i];
        let count = await this.db.getCounts(item)
        obj[item] = count
      }
      this.counts = obj
    },
    
    // 从文件夹路径获取文件夹名称
    parseFolderName(data){
      let temp = data.split("/")
      let i = temp.length - 2
      return temp[i]
    },

    // 从文件夹路径获取文件名称
    parseFileName(data){
      let temp = data.split("/")
      let i = temp.length - 1
      return temp[i]
    },

    // 存储到本地数据库
    async saveToLocal(data){
      let collection = await this.db.todos.where({block_id:data.block_id}).toArray()
      //如果没有获取到数据，则插入数据，否则执行更新操作
      if(collection.length == 0){
        await this.db.addTodo(data) 
      }else{
        let id = data.block_id;         delete data.block_id
        if(data.todo == 'null')       { delete data.todo }
        if(data.todo_index == 999)    { delete data.todo_index }
        if(data.priority == 'null')   { delete data.priority }
        if(data.priority_index == 999){ delete data.priority_index }

        await this.db.updateTodo(id,data)
      }
      
    },
    // 选择视图
    changeViewType(viewType){
      this.viewType = viewType
    },
    // 点击待办清单
    clickList(listGroup,listName){
      this.listGroup  = listGroup
      this.listName   = listName
      this.where      = listName
      this.order      = 'updated' //恢复默认排序，不保存用户上次选择记录
      this.getData()
    },
    // 变更排序规则
    changeOrderBy(orderBy){      
      this.order = orderBy      
      this.getData()
    },
    
    // 变更 todo 状态
    setTodoStatus(block_id,value){
      this.db.setTodoStatus(block_id,value) //更改本地数据
      let id = block_id
      let data = {"id": id, "attrs": {"custom-lz-todo": value}}
      setAttrs(data).then().catch((err)=>{ console.log(err) })
      this.getCounts() //重新计算列表数
    },

    updateTodo(block_id,data){
      this.db.updateTodo(block_id,data)
      let values = {}
      // values[custom-lz-todo] = data.todo
      if(Object.prototype.hasOwnProperty.call(data,'todo')){
        values['custom-lz-todo'] = data.todo
      }
      if(Object.prototype.hasOwnProperty.call(data,'priority')){
        values['custom-lz-priority'] = data.priority
      }
      console.log(values)
      let attrs = {"id": block_id, "attrs": values}
      setAttrs(attrs).then().catch((err)=>{ console.log(err) })

      this.getCounts()
      this.getData()
    },
    // 切换为卡片模式
    switchToCard(value){
      if(value){this.showCard = true}else{this.showCard = false}
    },
    // 弹出设置对话框
    showSettingDialog(){
      this.dialogVisible = true
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            console.log(_)
            done();
          })
          .catch(_ => {console.log(_)});
      },

  },
  created(){
    this.db   = new Database()
    this.date = DateUtil.DateUtil
  },
  mounted(){
    this.initWidget()
  },
})
</script>

<style>
body{
  color: #535353;
  /* background-color: #444; */
}
#little-things{
  font-size: 15px;
  margin: 15px;
  /* border: 1px solid #ddd; */
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  /* height: 500px; */
  min-width: 500px;
  border-radius: 6px;
  background-color: #FFF;
  overflow: hidden;
}
#top-bar{
  display: flex;
  height: 50px;
  /* background-color: #eaeaea; */
}
#main-content{
  display: flex;
  /* background-color: #fafafa; */
  height: 570px;
  /* max-height: 600px; */
  
}
.hidden{
  display: none !important;
}
.left-col, .right-col{
  padding: 15px;
}
.left-col{
  width:220px;
  background-color: #fdfdfd;
  flex-shrink: 0;
}
.right-col{
  width: 100%;
}
.list-view .right-col{
  background-color: #daf1ef;
}
.report .right-col{
  background-color: #f1e4da;
}

.btn:hover{
  color:rgb(11, 131, 131);
  cursor: pointer;
}


.logo{
  display: flex;
  flex-grow: 0;
  align-items: center;
  justify-content: space-between;
}
.logo .btn-group .btn{
  margin-left:8px;
}

.logo-name{
  font-weight: bolder;
  font-size: 16px;
}
.top-actions{
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
}
.top-actions .notes-count{
  font-size: 14px;
  font-weight: bold;
}
.top-actions .btn-group .btn{
  margin-left:15px;
}
/* 顶部下拉菜单 */
.el-dropdown-menu__item{
  display: flex;
  align-items: center;
}
.el-dropdown-menu__item .icon{
  height: 30px;
}
</style>
