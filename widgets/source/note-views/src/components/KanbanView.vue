<template>
  <div class="kanban">
    <div class="col inbox-list">
      <div class="head">收集箱 INBOX</div>
      <draggable
        class="inbox"
        :list="inbox"
        group="todolist"
        @change="handleInboxEvent"
        itemKey="id" >
        <template #item="{ element }">
          <div class="list-group-item" :id="element.id" @click="openNote(element.id)" title="单击打开文档，按住可拖动">{{ element.content }}</div>
        </template>
      </draggable>
    </div>

    <div class="col doing-list">
      <div class="head"> 进行中 DOING</div>
      <draggable
        class="doing"
        :list="doing"
        group="todolist"
        @change="handleDoingEvent"
        itemKey="id" >
        <template #item="{ element }">
          <div class="list-group-item" :id="element.id" @click="openNote(element.id)" title="单击打开文档，按住可拖动">{{ element.content }}</div>
        </template>
      </draggable>
    </div>

    <div class="col done-list">
      <div class="head">已完成 DONE</div>
      <draggable
        class="done"
        :list="done"
        group="todolist"
        @change="handleDoneEvent"
        itemKey="id" >
        <template #item="{ element }">
          <div class="list-group-item" :id="element.id" @click="openNote(element.id)" title="单击打开文档，按住可拖动">{{ element.content }}</div>
        </template>
      </draggable>
    </div>

    <div class="col someday-list">
      <div class="head">某天 SOMEDAY</div>
      <draggable
        class="someday"
        :list="someday"
        group="todolist"
        @change="handleSomedayEvent"
        itemKey="id">
        <template #item="{ element }">
          <div class="list-group-item" :id="element.id" @click="openNote(element.id)" title="单击打开文档，按住可拖动">{{ element.content }}</div>
        </template>
      </draggable>
    </div>

</div>
</template>
<script>
import draggable from "vuedraggable";
import {setAttrs} from '../utils/request'
export default {
  name: "todo-list",
  display: "Todo List",
  order: 1,
  components: {
    draggable
  },
  props:{
    data: null
  },
  data() {
    return {
      saveIndex: true, //是否开启记住排序位置,开启后将通过 lz_todo_index 属性记录位置
      firstLoading: true, //第一次 loading 时不会保存排序位置
      someday: [],
      doing:   [],
      done:    [],
      inbox:   [],
    };
  },
  methods: {
    openNote(id) { window.open("siyuan://blocks/" + id, "_blank")},
    
    /* 通过监听看板的 added 事件来更改待办类型，排序位置统一通过监听数组变动来实现 */
    handleAddedEvent(evt,type){
        if(Object.prototype.hasOwnProperty.call(evt,'added')){
        let todoType = { "id": evt.added.element.id, "attrs": {"custom-lz-todo": type,} }
        setAttrs(todoType).then().catch((err)=>{ console.log(err) })
      }
    },

    handleInboxEvent(evt)   {  this.handleAddedEvent(evt, 'inbox')   }, 
    handleDoingEvent(evt)   {  this.handleAddedEvent(evt, 'doing')   }, 
    handleDoneEvent(evt)    {  this.handleAddedEvent(evt, 'done')    }, 
    handleSomedayEvent(evt) {  this.handleAddedEvent(evt, 'someday') }, 
    
    // 将原始数据按照待办状态分组
    parseData(){
      let data            = this.data
      let temp_someday    = [] //创建临时存储，避免多次加载数据时出现重复
      let temp_doing      = []
      let temp_done       = []
      let temp_inbox      = []
      
      if(data){
        for (let i = 0; i < data.length; i++) {
          const todo = data[i].custom_lz_todo;
          if(todo == "someday"){temp_someday.push(data[i])}
          if(todo == "doing"){temp_doing.push(data[i])}
          if(todo == "done"){temp_done.push(data[i])}  
          if(todo != "someday" && todo != "doing" && todo !="done"){temp_inbox.push(data[i])}  
        }
      }else{
        console.log("文档数据为空！")
      }

      // 按照custom_lz_todo_index排序
      this.someday    =   this.sortData(temp_someday)
      this.doing      =   this.sortData(temp_doing)
      this.done       =   this.sortData(temp_done)
      this.inbox      =   this.sortData(temp_inbox)

    },

    // 通过监控数组变动来上传最新排序位置
    saveSortIndex(data){
      if(this.firstLoading){ console.log("初始数据导入时将不会上传排序位置")}
      if(data.length != 0 && !this.firstLoading){
        console.log("上传排序位置：")
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          const id        = data[i]['id'];
          const todoIndex = { "id": id,  "attrs": {"custom-lz-todo-index": i.toString()} }
          setAttrs(todoIndex).then().catch((err)=>{ console.log(err) })
        }
      }
      
    },

    // 冒泡排序
    sortData(data){
      if(data){
        let tempData = data
        let len = data.length
        for (let i = 0; i < len; i++) {
          for (let j = 0; j < len - 1 - i; j++) {
            let a = parseInt(tempData[j]['custom_lz_todo_index'])
            let b = parseInt(tempData[j+1]['custom_lz_todo_index'])
            a = a ? a:0
            b = b ? b:0
            if( a > b){ //相邻元素两两比较
              let temp = tempData[j+1] //元素交换
              tempData[j+1] = tempData[j]
              tempData[j] = temp
            }
          }
        }
        return tempData
      }else{
        console.log("待排序数组为空")
        return false
      }
    }

  },

  watch: { 
    data() { this.parseData() }, //父级内容变动后（比如重命名后点击刷新按钮）重新处理数据
    //深度监听,可监听到数组排序的变化，实时上传最新排序位置
    inbox:{
      handler(){ if(this.saveIndex){ this.saveSortIndex(this.inbox)}},
      deep:true
    },
    doing:{
      handler(){ if(this.saveIndex){ this.saveSortIndex(this.doing)}},
      deep:true
    },
    done:{
      handler(){ if(this.saveIndex){ this.saveSortIndex(this.done)}},
      deep:true
    },
    someday:{
         handler(){ if(this.saveIndex){ this.saveSortIndex(this.someday) } },
         deep:true 
     }
  },

  created(){
    this.parseData()
    this.firstLoading = false //第一次加载时不上传位置，因为已经是最新
  },


};
</script>
<style scoped>
.kanban{
  display: flex;
  justify-content: center;
}

.col{
  margin: 5px 8px;
  padding: 5px;
  /* border:1px solid #EEE; */
  background-color: #fafafa;
  /* border-radius: 3px; */
  min-height: 400px;
  width: 220px;
}
.col .head{
  font-weight: bold;
  margin: 16px 8px 18px 8px;
  padding-left: 10px;
  border-left: 3px solid #aaa;
}
.inbox-list .head{
  border-color:#409eff;
}
.doing-list .head{
  border-color: #e6a23c;
}
.done-list .head{
  border-color: #67c23a;
}
.list-group-item{
    border:1px solid #efefef;
    background-color: #fff;
    padding: 8px 10px;
    margin: 6px 5px;
    border-radius: 6px;
    cursor: pointer;
}
.list-group-item:hover{
  border-color: #dedede;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
}
</style>