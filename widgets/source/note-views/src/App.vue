<template>
<div id="app">
  <!-- 设置弹框 -->
  <div class="setting">
    <el-dialog
      title="设置"
      v-model="dialogVisible"
      width="40%"
      >
      <!-- 表单 -->
      <el-form ref="setting" :model="setting" label-width="120px">
        <el-form-item label="自定义 SQL">
          <el-input type="textarea" v-model="setting.userSQL" placeholder="暂未设置自定义 SQL"></el-input>
        </el-form-item>
        <el-form-item label="当前执行 SQL">
           <span style="padding:2px 4px;border-radius:2px;color:#e6a23c;background-color:#fdf6ec">{{sql}}</span>
        </el-form-item>
       
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="saveSetting('cancle')">取 消</el-button>
          <el-button type="primary" @click="saveSetting('ok')">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <div id="header">
    <div class="folder-infor">
      <span class="folder-name">{{ folderName }}</span>
      <span class="total-number">{{ totalNumber }} 篇笔记</span>
      <span v-if="customSQL" style="font-size:12px;padding:2px 4px;border-radius:2px;color:#e6a23c;background-color:#fdf6ec">自定义查询</span>
    </div>

    <div class="button-group">
      <el-button size="small" icon="el-icon-setting" @click="showSettingDialog()" ></el-button>
      <el-button size="small" icon="el-icon-refresh" @click="getData()" ></el-button>
      
      <el-select v-model="orderType" placeholder="排序类型" size="small" :disabled="viewType === 'KanbanView' ? true:false" @change="getData()" class="set-order-type action-btn" style="width:80px !important;">
        <el-option
          v-for="item in orderTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
      </el-select>
    
      <el-select v-model="orderField" placeholder="排序字段" size="small" :disabled="viewType === 'KanbanView' ? true:false" @change="getData()" class="set-order-type action-btn">
        <el-option
          v-for="item in orderFieldOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
      </el-select>
    
      <el-select v-model="pageSize" placeholder="分页大小" size="small" :disabled="viewType === 'CalendarView'||viewType === 'KanbanView'?true:false" @change="getData(false)" class="set-page-size action-btn">
        <el-option
          v-for="item in pageSizeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
      </el-select>

      <el-select v-model="viewType" placeholder="视图类型" size="small" @change="getData()" class="set-view-type action-btn">
        <el-option
          v-for="item in viewTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
      </el-select>

    </div>

  </div>

<!----------------- content ---------------------->

  <div id="content" v-loading="loading" element-loading-text="拼命加载中">
      <template v-if="compData">
        <keep-alive>
        <component :is="viewType" :data="compData"></component>
        </keep-alive>
      </template>
      <template v-else>
        <el-empty  description="内容为空" ></el-empty>
      </template>
  </div>

<!------------------- pagenav -------------------->

  <div id="page-nav" v-if="showPageNav">
      <el-pagination
        small
        hide-on-single-page
        layout="prev, pager, next"
        v-model:current-page= "currentPage"
        :page-size="pageSize"
        :total="totalNumber"
        @next-click="setPageNumber"
        @current-change="setPageNumber">
      </el-pagination>
  </div>
  
</div>
</template>

<script>
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import {queryData, embedAttrs, setAttrs} from './utils/request'
import {log, parseRaw, getUrlParam} from './utils/tools'
import {systemConfigs} from './utils/config'
import Dashboard from './components/Dashboard.vue'
import TableView from './components/TableView.vue'
import ListView from './components/ListView.vue'
import CardView from './components/CardView.vue'

import CalendarView from './components/CalendarView.vue'
import KanbanView from './components/KanbanView.vue'

export default defineComponent({
  name: 'App',
  components: {
    Dashboard,
    CardView,
    ListView,
    TableView,
    CalendarView,
    KanbanView
  },
  data(){
    return{
      blockId:      null,
      attributes:   null,
      noteBox:      null,
      folderPath:   null,
      folderName:   "思源笔记",
      viewType:     "CardView",
      pageSize:     6,
      pageOffset:   0,
      currentPage:  2,
      totalNumber:  0,
      orderField:   "updated",
      orderType:    "DESC",
      totalData:    null, //全量数据
      pageData:     null,   //分页数据
      compData:     null,   //传递给子组件的数据
      dialogVisible: false,
      viewTypeOptions:  null,
      orderTypeOptions: null,
      orderFieldOptions: null,
      pageSizeOptions:null,
      loading:      false,
      customSQL: null,
      sql: '',
      setting:{
        userSQL: null,
      },
    }
  },

  computed:{
    showPageNav(){
      return  this.viewType == "CalendarView" || this.viewType == "KanbanView" ? false:true
    }
  },

  methods:{
    // 初始化挂件
    async initWidget(){
    try {
      // 设置菜单选项
      this.viewTypeOptions    = systemConfigs.viewTypeOptions
      this.orderTypeOptions   = systemConfigs.orderTypeOptions
      this.orderFieldOptions  = systemConfigs.orderFieldOptions
      this.pageSizeOptions    = systemConfigs.pageSizeOptions

      // 从 url 中获取 blockid 参数
      const block_id = getUrlParam("blockid")
      if(block_id){
        this.blockId = block_id
      } else{
        ElMessage.error("请在URL中配置块ID（blockid=XXX）")
        throw "url 中未配置 blockid 信息"
      }


      if(await this.getWidgetSettings(this.blockId) ){
        this.getData() //请求数据
      }
      

      } catch(error) {
        this.loading = false //关闭 loading
        console.log("%c[initWidget]挂件初始化出错：", "color: red")
        log(error)
      }
    },

    //获取挂件块设置
    async getWidgetSettings(blockId){
      const sql = "SELECT b.id AS id, b.box AS box, b.type AS type, b.path AS path, a.name AS attrName, a.value AS attrValue FROM blocks AS b LEFT JOIN attributes AS a ON b.id = a.block_id WHERE b.id = '" + blockId + "'"
      
      try {
        let result = await queryData(sql)
        if(result.length == 0){throw "未查询到对应的块内容 BlockId:"+blockId}
        
        this.attributes = result
        this.noteBox = result[0].box
        
        // 获取文件夹路径
        let path = result[0].path.split("/")
        path.pop()
        path = path.join("/") + "/"
        this.folderPath = path

        // 设置展示的文件夹名称
        let folder =this.parseFolderName(path)
        if(folder){ this.folderName = folder }

        // 遍历获取块属性设置
        log("获取用户之前保存的设置：")
        result.forEach(data => {
          let attrName = data.attrName;

          if(attrName == "custom-lz-order-type"){
              this.orderType = data.attrValue
              console.log(" * ordertype："+ this.orderType)
            }  

          if(attrName == "custom-lz-order-field"){
            this.orderField = data.attrValue
            console.log(" * orderfield："+ this.orderField)
          }

          if(attrName == "custom-lz-page-size"){
            this.pageSize = parseInt(data.attrValue) //类型转换
            console.log(" * pagesize："+ this.pageSize)
          }

          if(attrName == "custom-lz-view-type"){
            this.viewType = data.attrValue
            console.log(" * viewtype："+ this.viewType)
          }

          if(attrName == "custom-lz-user-sql"){
            this.customSQL = data.attrValue
            this.setting.userSQL = data.attrValue
            console.log(" * userSQL："+ this.setting.userSQL)
          }

        })

        return true
        
      } catch (error) {
        console.log("%c[getWidgetSettings]获取挂件块属性出错：", "color: red")
        log(error)
      }

    },

    // 从文件夹路径获取文件夹名称
    parseFolderName(data){
      let temp = data.split("/")
      let i = temp.length - 2
      return temp[i]
    },

    // 构建 SQL 语句
    createSQL(){
      let sql_box         = ""
      let sql_path        = ""

      if(this.noteBox)   { sql_box  = " AND box='" + this.noteBox + "'" }
      if(this.folderPath){ sql_path = " AND path LIKE '%" + this.folderPath + "%'" }
      if(this.orderType == "降序"){ this.orderType = "DESC"} //兼容之前版本
      if(this.orderType == "升序"){ this.orderType = "ASC"}

      let sql_order  = " ORDER BY " + this.orderField + " " + this.orderType
      let sql   
      if(this.customSQL){
        sql = this.customSQL + sql_order
      }else{
        sql = "SELECT * FROM blocks WHERE type='d'" + sql_box + sql_path + sql_order
      }
      this.sql = sql
      return sql
    },

    /* 获取数据
    * @reload: true:重新网络请求； false：数组分页，无需再次请求
     */
    async getData(reload=true){
    try {
      if(reload){
        if(!systemConfigs.IS_TEST){this.loading = true} //开启 loading 效果
        let sql  = this.createSQL()
        let data = await queryData(sql)
        data     = parseRaw(data,3) //获取文章封面，转换日期格式
        let result =   await embedAttrs(data)
        if(!systemConfigs.IS_TEST){this.loading = false}

        if(result.length > 0){
          this.totalData = result //全量数据
          this.pageData = this.parsePage(this.totalData) //分页处理
          this.totalNumber = result.length
          log("数据查询SQL：" + sql);
          log("获得全量数据："); log(this.totalData)
          log("获取分页数据："); log(this.pageData)
          }else{  throw "未取得符合条件的数据" }

      }else{
        log('采用数组分页，加载分页数据无需再次请求网络')
        this.pageData = this.parsePage(this.totalData)
      }

      // 传值给子组件
      if( this.viewType == "KanbanView" || this.viewType == "CalendarView"){
          this.compData = this.totalData } else{  
          this.compData = this.pageData  
      }

    }catch(error) {
        this.loading = false //关闭 loading
        console.log("%c[getData]获取数据出错：", "color: red")
        log(error)
    }
    },

    // 分页处理
    parsePage(data){
      let end  = this.pageOffset + this.pageSize
      console.log("当前分页： " + this.pageOffset + " - " + end)
      return data.slice(this.pageOffset, this.pageOffset + this.pageSize)
    },

    // 分页触发数据刷新，不涉及查询条件的变动，不需要重新查询数据
    setPageNumber(val){
      this.pageOffset = (val - 1) * this.pageSize
      this.getData(false)
      // this.pageData = this.parsePage(this.totalData)
    },
    
    // 弹出设置对话框
    showSettingDialog(){
      this.dialogVisible = true
    },
    saveSetting(value) {
      if(value == 'ok'){
        setAttrs({'id':this.blockId,'attrs':{'custom-lz-user-sql':this.setting.userSQL}}).then(()=>{
        this.customSQL = this.setting.userSQL
        this.dialogVisible = false
        this.getData('reload')
      }) 
      }else{
        this.setting.userSQL = this.customSQL
        this.dialogVisible = false
      }
       
    }
      
  },

  mounted(){
    // 初始化挂件
     this.initWidget()
  },

  watch:{
    // 设置监听，保存用户设置
    viewType(){
      // console.log("【更改视图类型，重新获取数据】")
      let block_id = this.blockId
      let attr_value = this.viewType
      let data = {"id": block_id, "attrs": {"custom-lz-view-type": attr_value,}}
      setAttrs(data).then().catch((err)=>{ console.log(err) })
    },
    orderType(){
      // console.log("【更改排序类型，重新获取数据】")
      let block_id = this.blockId
      let attr_value = this.orderType
      let data = {"id": block_id, "attrs": {"custom-lz-order-type": attr_value,}}
      setAttrs(data).then().catch((err)=>{ console.log(err) })
    },
    pageSize(){
      // console.log("【更改分页大小，重新获取数据】")
      let block_id = this.blockId
      let attr_value = "" + this.pageSize //需要将 int 类型转换成 string
      let data = {"id": block_id, "attrs": {"custom-lz-page-size": attr_value,}}
      setAttrs(data).then().catch((err)=>{ console.log(err) })
    },
    orderField(){
      // console.log("【更改排序字段，重新获取数据】")
      let block_id = this.blockId
      let attr_value = this.orderField
      let data = {"id": block_id, "attrs": {"custom-lz-order-field": attr_value,}}
      setAttrs(data).then().catch((err)=>{ console.log(err) })
    },

  },

  
})
</script>


<style scoped>
#app {
  font-size: 16px;
  color: #454545;
  /* padding: 10px; */
}

#header{
  display: flex;
  align-content: center;
  justify-content: space-between;
  border-bottom: 1px solid #EEE;
  padding: 10px;
  margin: 0 0 10px 0
}

.folder-infor{
  display: flex;
  align-items: center;
}
.folder-name{
  font-size: 18px;
  font-weight: bold;
}
.total-number{
  margin:10px;
  color: #999;
  font-size: 80%;
}

.button-group{
  margin: 0 10px;
  /* display: flex; */
}
.button-group button, .action-btn{
  margin: 0 5px !important;
}
.action-btn{
  width: 100px;
}
#content{
  
}
#page-nav{
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}
</style>
