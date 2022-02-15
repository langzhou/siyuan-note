<template>
<div>
  <div class="left-col" >
    <div class="todo-lists">
      <div class="all-lists" @click="clickList('all','all')"  :class="listName == 'all' ? 'chosen':'' ">
        <div class="list-name primary">全部事项</div>
        <div class="list-number" :class="counts.all > 0 ? 'deeper':'' ">{{counts.all ? counts.all : 0}}</div>
      </div>

      <div class="list-group">
        <div class="list-head">待办</div>
        <ul>
          <li @click="clickList('todo','inbox')" :class="listName == 'inbox' ? 'chosen':'' ">
            <div class="list-name normal">收集箱</div>
            <div class="list-number" :class="counts.inbox > 0 ? 'deeper':'' ">{{counts.inbox ? counts.inbox : 0}}</div>
          </li>
          <li @click="clickList('todo','doing')" :class="listName == 'doing' ? 'chosen':'' ">
            <div class="list-name warning">进行中</div>
            <div class="list-number" :class="counts.doing > 0 ? 'deeper':'' ">{{counts.doing ? counts.doing : 0}}</div>
          </li>
          <li @click="clickList('todo','someday')" :class="listName == 'someday' ? 'chosen':'' ">
            <div class="list-name primary">某天</div>
            <div class="list-number" :class="counts.someday > 0 ? 'deeper':'' ">{{counts.someday ? counts.someday : 0}}</div>
          </li>
          <li @click="clickList('todo','done')" :class="listName == 'done' ? 'chosen':'' ">
            <div class="list-name success">已完成</div>
            <div class="list-number" :class="counts.done > 0 ? 'deeper':'' ">{{counts.done ? counts.done : 0}}</div>
          </li>
        </ul>
      </div>
     
      <div class="list-group">
        <div class="list-head">日期</div>
        <ul >
          <li @click="clickList('date','today')" :class="listName == 'today' ? 'chosen':'' ">
            <div class="list-name danger">今天</div>
            <div class="list-number" :class="counts.today > 0 ? 'deeper':'' ">{{counts.today ? counts.today : 0}}</div>
          </li>
          <li @click="clickList('date','tomorrow')" :class="listName == 'tomorrow' ? 'chosen':'' ">
            <div class="list-name warning">明天</div>
            <div class="list-number" :class="counts.tomorrow > 0 ? 'deeper':'' ">{{counts.tomorrow ? counts.tomorrow : 0}}</div>
          </li>
          <li @click="clickList('date','week')" :class="listName == 'week' ? 'chosen':'' ">
            <div class="list-name success">本周</div>
            <div class="list-number" :class="counts.week > 0 ? 'deeper':'' ">{{counts.week ? counts.week : 0}}</div>
          </li>
          <li @click="clickList('date','month')" :class="listName == 'month' ? 'chosen':'' ">
            <div class="list-name primary">本月</div>
            <div class="list-number" :class="counts.month > 0 ? 'deeper':'' ">{{counts.month ? counts.month : 0}}</div>
          </li>
        </ul>
      </div>

      <div class="list-group">
        <div class="list-head">优先级</div>
        <ul>
          <li @click="clickList('priority','P0')" :class="listName == 'P0' ? 'chosen':'' ">
            <div class="list-name danger">P0</div>
            <div class="list-number" :class="counts.P0 > 0 ? 'deeper':'' ">{{counts.P0 ? counts.P0 : 0}}</div>
          </li>
          <li @click="clickList('priority','P1')" :class="listName == 'P1' ? 'chosen':'' ">
            <div class="list-name danger">P1</div>
            <div class="list-number" :class="counts.P1 > 0 ? 'deeper':'' ">{{counts.P1 ? counts.P1 : 0}}</div>
          </li>
          <li @click="clickList('priority','P2')" :class="listName == 'P2' ? 'chosen':'' ">
            <div class="list-name warning">P2</div>
            <div class="list-number" :class="counts.P2 > 0 ? 'deeper':'' ">{{counts.P2 ? counts.P2 : 0}}</div>
          </li>
          <li @click="clickList('priority','P3')" :class="listName == 'P3' ? 'chosen':'' ">
            <div class="list-name success">P3</div>
            <div class="list-number" :class="counts.P3 > 0 ? 'deeper':'' ">{{counts.P3 ? counts.P3 : 0}}</div>
          </li>
        </ul>
      </div>

    </div>
  </div>

  <div class="right-col">
    
      <el-scrollbar :native="false">
      <div v-if="compData.length != 0">
      <draggable
        class="note-list" :class="showCard"
        :list="compData"
        :disabled="!enableDrag"
        item-key="name"
        @start="dragging = true"
        @end="dragging = false" >
        <template #item="{ element }">        
          <div class="list-item" :class="getStyle('checked',element.todo)" :id="'block-' + element.block_id" @contextmenu="rightMenu($event,element.block_id)">
            <div class="checkbox" :class="getStyle('priority',element.priority)" @click="setDone(element.block_id,element.todo)">
              <span class="el-checkbox__input" :class="element.type">
                <span class="el-checkbox__inner"></span>
                <input class="el-checkbox__original" type="checkbox" value="false">
                </span> 
              </div>
            <div style="flex-grow:1;">
              <div class="note-content" v-if="showRawContent == 'yes'">{{element.raw_content}}</div>
              <div class="note-content" v-else>{{element.pure_content}}</div>
              <div class="note-attrs">
                <div><span class="doc" @click="openNote(element.block_id)">@{{element.doc}} </span><span v-if="element.due"> @{{element.due}} </span></div>
              </div>
            </div>

          </div>    
        </template>
      </draggable>
      </div>
      <div style="height:100%" v-else><el-empty description="暂无内容" style="display:flex;align-items:center;height:100%;"></el-empty></div>
     </el-scrollbar>

    
  </div>


</div>
</template>
<script>
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import draggable from "vuedraggable";
import {getTagStyle} from '../utils/tools'
import {setAttrs} from '../utils/request'
export default defineComponent({
  name: "ListView",
  display: "ListView",
  order: 0,
  components: {
    draggable
  },
  props:{
    compData:null,
    counts:null,
  },
  computed:{
    showCard(){
      if(this.$parent.showCard){ return "h-list" }else{ return "v-list" }
    },  
    showRawContent(){
      return this.$parent.setting.rawContent
    },
    listName(){
      return this.$parent.listName
    },
    enableDrag(){
      if(this.$parent.order == 'custom'){
        return true
      }else{
        return false
      }
    }
  },
  data() {
    return {
      dragging: false,
      preTodoStatus:{}, //用于记录标记为完成之前的 todo 状态
    }   
  },

  methods: {
    openNote(id) { window.open("siyuan://notes/" + id, "_blank")},
    clickList(listGroup,listName){
      this.$parent.clickList(listGroup,listName)
    },

    setDone(id,todoStatus){
      let el = document.querySelector('#block-'+id)
      if(el.classList.contains('is-checked')){
        el.classList.remove('is-checked') 
        let todo = this.preTodoStatus[id]?this.preTodoStatus[id]:'inbox' //恢复之前的todo 状态
        this.$parent.setTodoStatus(id,todo)
        delete this.preTodoStatus[id]
      }else{
        this.preTodoStatus[id] = todoStatus
        el.classList.add('is-checked') 
        this.$parent.setTodoStatus(id,'done')
      }
    },
    // 更新 todo 和优先级状态
    updateStatus(block_id,type,value){
      let data = {}
      data[type] = value
      this.$parent.updateTodo(block_id,data)
      // let listGroup = this.$parent.listGroup
      // let listName = this.$parent.listName
      /* if(listGroup == type && listName != value){
        let div = document.querySelector('#block-'+block_id)
        div.remove()
      } */
      ElMessage.success({ message: '操作成功',  type: 'success' });
      
    },

    // 保存自定义排序
    saveIndex(){
      let listGroup = this.$parent.listGroup
      let data      = this.compData
      for (let i = 0; i < data.length; i++) {
          let id = data[i]['block_id'];
          let remoteIndex,localIndex
          if(listGroup == 'todo'){
            remoteIndex = { "id": id,  "attrs": {"custom-lz-todo-index": i.toString()} }
            localIndex = {todo_index: i}
          }else{
            remoteIndex = { "id": id,  "attrs": {"custom-lz-priority-index": i.toString()} }
            localIndex = {priority_index: i}
          }
          setAttrs(remoteIndex).then().catch((err)=>{ console.log(err) })
          this.$parent.updateTodo(id,localIndex)
        }


    },

    getStyle(type,value){
      if(type == 'priority'){
        return getTagStyle(value)
      }
      if(type == 'checked'){
        if(value == 'done'){
          return 'is-checked'
        }else{
          return ''
        }
      }
    },

    rightMenu(e,id) {
     e.preventDefault();
      this.$contextmenu({
        x: e.x,
        y: e.y,
        items: [
          { 
            label: "待办状态", icon:"primary",
            children: [
              { label: "Inbox" , icon:"normal",   onClick:()=>{this.updateStatus(id,'todo','inbox')} },
              { label: "Doing" , icon:"warning",  onClick:()=>{this.updateStatus(id,'todo','doing')} },
              { label: "Done" ,  icon:"success",  onClick:()=>{this.updateStatus(id,'todo','done')} },
              { label: "Someday",icon:"primary",  onClick:()=>{this.updateStatus(id,'todo','someday')} },
              { label: "移除",    icon:"normal",   onClick:()=>{this.updateStatus(id,'todo','')} },
            ]
          },
          { 
            label: "优先级", icon:"primary",
            children: [
              { label: "P0" , icon:"danger",  onClick:()=>{this.updateStatus(id,'priority','P0')} },
              { label: "P1" , icon:"danger",  onClick:()=>{this.updateStatus(id,'priority','P1')} },
              { label: "P2" , icon:"warning", onClick:()=>{this.updateStatus(id,'priority','P2')} },
              { label: "P3" , icon:"success", onClick:()=>{this.updateStatus(id,'priority','P3')} },
              { label: "移除", icon:"normal", onClick:()=>{this.updateStatus(id,'priority','')} },
            ]
          },
        ]
      });
    // 关闭右键菜单
    const  menu = document.querySelector('.mx-context-menu-host');
        menu.addEventListener('click', () => {
          let div = document.querySelector('.mx-context-menu-host')
          if(div){div.remove()}
        })

    },

  

  },


  watch:{
    compData:{
      handler(){ 
        if(this.$parent.order == 'custom' && (this.$parent.listGroup == 'todo' || this.$parent.listGroup == 'priority')){
          this.saveIndex()} 
          },
      deep:true,
    },
  },

})

</script>
<style>
.tag{
  font-weight: bold;
}
.list-view-comp .left-col{
  border-top: 1px solid #eee;
  padding: 0;
  width: 250px;
}

.list-view-comp .right-col{
  padding-top: 0;
}

.all-lists{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 6px 0;
  padding: 8px 25px 8px 15px;
  cursor: pointer;
}
.all-lists:hover{
  background-color: #eee;
}
.all-lists .list-name{
  font-weight: bold;
}
.all-lists.chosen {
  background-color: #eee;
}
.todo-lists .list-number{
  color:#aaa;
  font-size: 14px;
}
/* 大于 0 时采用深色字体 */
.todo-lists .list-number.deeper{
  color: #666;
  /* font-weight: bold; */
}
.chosen .list-number{
  font-weight: bold;
}
.list-group{
  margin:10px 0;
}
.list-group .list-head{
  font-weight: bold;
  margin: 5px 0;
  padding: 0 15px;
}
.list-group ul{
  margin:0;
  padding: 0;
}
.list-group li{
  list-style: none;
  /* border-radius: 3px; */
  margin:0;
  padding:6px 25px 6px 15px;
  /* background-color: red; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.list-group li:hover,.list-group li.chosen{
  background-color: #eee;
}

.list-group .list-name{
  position: relative;
  padding-left: 25px;
}
.list-group .list-name::before{
  content: "";
  width:8px;
  height: 8px;
  background-color: #666;
  border-radius: 10px;
  position: absolute;
  top:8px;
  left: 10px;
}

/* 垂直布局，列表模式 */
.right-col .v-list{
  display: flex;
  flex-direction: column;
}
/* 横向布局，卡片模式 */
.right-col .h-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.right-col .h-list .list-item{
  /* 动态计算宽度，平均分为 3 列 */
  width: calc((100% - 3 * 8px - 3 * 2px - 3 * 20px) / 3);
  
}
.right-col .h-list .list-item .note-content{
  max-height:100px;
  /* word-break:keep-all; */
  /* white-space:nowrap; */
  overflow:hidden;/*内容超出宽度时隐藏超出部分的内容*/ 
  text-overflow:ellipsis;
  
}

.list-item{
  padding:10px;
  margin:4px;
  background-color: #fff;
  /* border:1px solid #ededed; */
  border-radius: 4px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.06);
  display: flex;
}
.list-item:hover{
  /* border: 1px solid #409eff; */
}
.note-list{
  /* overflow-y: scroll; */
  height: 100%;
}

.note-content{
  cursor: pointer;
  line-height: 1.6em;
  word-break: break-all;
}
.is-checked .note-content{
  color: #999;
  text-decoration: line-through;
}
.note-attrs{
  margin-top: 2px;
  font-size: 13px;
  color:#aaa;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.note-attrs .doc:hover{
  color:#555;
  cursor: pointer;
}
.list-name.danger::before, .mx-context-menu-item .danger{
  background-color: #f56c6c !important;
}
.list-name.warning::before, .mx-context-menu-item .warning{
  background-color: #e6a23c !important;
}
.list-name.success::before, .mx-context-menu-item .success{
  background-color: #67c23a !important;
}
.list-name.primary::before, .mx-context-menu-item .primary{
  background-color: #409eff !important;
}
.list-name.normal::before, .mx-context-menu-item .normal{
  background-color: #666 !important;
}
</style>

<style scoped>
/* 饿了么 checkbox */
.checkbox{
  margin-right:5px;
}
.danger .el-checkbox__inner{
  border-color:#f56c6c;
  background-color: #f56c6c20;
}
.warning .el-checkbox__inner{
  border-color: #e6a23c;
  background-color: #e6a23c20;
}
.success .el-checkbox__inner{
  border-color: #67c23a;
  background-color: #67c23a20;
}

.is-checked .el-checkbox__input .el-checkbox__inner:after {
    transform: rotate(45deg) scaleY(1);
}
.is-checked .el-checkbox__input .el-checkbox__inner {
    background-color: #cdcdcd !important;
    border-color: #cdcdcd !important;
}
.el-checkbox__inner:after {
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 8px;
    width: 3px;
    left: 5px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    transition: transform .15s ease-in .05s;
    transform-origin: center;
}

.el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 2px solid #bbb;
    border-radius: 20px;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    background-color: #fff;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
}
.el-checkbox {
    margin:0;
    padding: 0;;
    color: #606266;
    font-weight: 500;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    user-select: none;
    margin-right:30px;}

.el-checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
}

</style>