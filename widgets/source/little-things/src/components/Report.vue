<template>
<div>
  <div class="left-col" >
    <div class="todo-lists">
      <div class="all-lists" >
        <div class="list-name primary">全部事项</div>
        <div class="list-number">0</div>
      </div>

      <div class="list-group">
        <div class="list-head">待办</div>
        <ul>
          <li >
            <div class="list-name normal">收集箱</div>
            <div class="list-number">0</div>
          </li>
          <li >
            <div class="list-name warning">进行中</div>
            <div class="list-number">0</div>
          </li>
          <li>
            <div class="list-name primary">某天</div>
            <div class="list-number">0</div>
          </li>
          <li>
            <div class="list-name success">已完成</div>
            <div class="list-number">0</div>
          </li>
        </ul>
      </div>
     
     

    </div>
  </div>

  <div class="right-col">
    <div class="report-btn">
      <el-select v-model="value" placeholder="请选择" size="small">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    </div>

    <div class="report-content">
      该模块待开发...
    </div>
    

    
  </div>


</div>
</template>
<script>
import { defineComponent } from 'vue'
/* import { ElMessage } from 'element-plus'
import draggable from "vuedraggable";
import {getTagStyle} from '../utils/tools'
import {setAttrs} from '../utils/request' */
export default defineComponent({
  data(){
    return{
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
    }
  }
})

</script>
<style>

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

.report-content{
  padding:10px;
  margin:10px 0;
  border-radius: 3px;
  background-color: #fff;
}


</style>