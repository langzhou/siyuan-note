<template>
<div id="table-view">
<el-table
    :data="data"
    border
    style="width: 100%">
    <el-table-column
      prop="content"
      label="标题"
      sortable
      min-width="150">
      <template #default="scope">
        <div class="title" @click="openNote(scope.row.id)"><span>{{scope.row.content}}</span></div>
      </template>
    </el-table-column>
    <el-table-column
      prop="new_created"
      label="创建日期"
      width="150">
    </el-table-column>
    <el-table-column
      prop="new_updated"
      label="更新日期"
      width="150">
    </el-table-column>
    <el-table-column
      prop="custom_lz_priority"
      label="优先级"
      :filters="[{ text:'P0',value:'P0'}, { text: 'P1', value: 'P1' }, { text: 'P2', value: 'P2' }, { text: 'P3', value: 'P3' }]"
      :filter-method="filterPriority"
      filter-placement="bottom-end"
      width="90"
      align='center'>
      <template #default="scope">
        <!-- <el-tag :type="getStyle(scope.row.custom_lz_priority)"  disable-transitions v-if="scope.row.custom_lz_priority">{{scope.row.custom_lz_priority}}</el-tag> -->
        <el-dropdown trigger="click" @command="setStatus">
          <span class="el-dropdown-link" :id="'priority-' + scope.row.id">
            <el-tag :type="getStyle(scope.row.custom_lz_priority)"  disable-transitions v-if="scope.row.custom_lz_priority">{{scope.row.custom_lz_priority}}</el-tag>
            <span class="tip-text" v-else>点击设置</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="scope.row.id+'|priority|P0'"><el-tag :type="getStyle('P0')">P0</el-tag></el-dropdown-item>
              <el-dropdown-item :command="scope.row.id+'|priority|P1'"><el-tag :type="getStyle('P1')">P1</el-tag></el-dropdown-item>
              <el-dropdown-item :command="scope.row.id+'|priority|P2'"><el-tag :type="getStyle('P2')">P2</el-tag></el-dropdown-item>
              <el-dropdown-item :command="scope.row.id+'|priority|P3'"><el-tag :type="getStyle('P3')">P3</el-tag></el-dropdown-item>
              <el-dropdown-item :command="scope.row.id+'|priority|'"><el-tag type="info">remove</el-tag></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
    <el-table-column
      prop="custom_lz_todo"
      label="待办"
      width="120"
      align="center"
      :filters="[{ text: 'inbox', value: 'inbox' },{ text: 'doing', value: 'doing' }, { text: 'done', value: 'done' },{ text: 'someday', value: 'someday' },]"
      :filter-method="filterTodo"
      filter-placement="bottom-end" >
      <template #default="scope">
        <el-dropdown trigger="click" @command="setStatus">
          <span class="el-dropdown-link" :id="'todo-' + scope.row.id">
            <el-tag :type="getStyle(scope.row.custom_lz_todo)"  disable-transitions v-if="scope.row.custom_lz_todo">{{scope.row.custom_lz_todo}}</el-tag>
            <span class="tip-text" v-else>点击设置</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="scope.row.id+'|todo|inbox'"><el-tag type="info">inbox</el-tag></el-dropdown-item>
              <el-dropdown-item :command="scope.row.id+'|todo|doing'"><el-tag type="warning">doing</el-tag></el-dropdown-item>
              <el-dropdown-item :command="scope.row.id+'|todo|someday'"><el-tag type="primary">someday</el-tag></el-dropdown-item>
              <el-dropdown-item :command="scope.row.id+'|todo|done'"><el-tag type="success">done</el-tag></el-dropdown-item>
              <el-dropdown-item :command="scope.row.id+'|todo|'"><el-tag type="info">remove</el-tag></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
    <el-table-column
      prop="memo"
      label="备注">
      <template #default="scope">
        <span v-if="scope.row.memo" @click="setMemo(scope.row.id)" :id="'memo-'+scope.row.id" class="memo">{{ scope.row.memo }}</span>
        <span v-else class="tip-text" @click="setMemo(scope.row.id)" :id="'memo-'+scope.row.id">点击设置</span>
      </template>
    </el-table-column>
  </el-table>
  <div style="font-size:14px;color:#AAA;padding:8px 5px 0 0;"><strong>注意：</strong>表格内「优先级」「待办事项」快捷筛选功能仅展示该分页内筛选后的内容</div>
</div>
</template>

<script>
import {getTagStyle} from '../utils/tools'
import {setAttrs} from '../utils/request'
export default {
  props:{
    data: null,
  },
  methods:{
        openNote(id) { window.open("siyuan://blocks/" + id, "_blank")},
        getStyle(value,type='element'){ return getTagStyle(value,type) },
        filterPriority(value, row){
        return row.custom_lz_priority == value
        },
        
        filterTodo(value, row) {
          return row.custom_lz_todo === value;
        },

        setStatus(value){
          let val = value.split('|')
          let type = val[1]
          let style = this.getStyle(val[2])
          let el = document.querySelector('#'+type+'-'+val[0])
          if(val[2] == ''){
            el.innerHTML = '<span class="el-tag el-tag--info el-tag--light">设置</span>'
          }else{
            el.innerHTML = '<span class="el-tag el-tag--'+ style +' el-tag--light">'+val[2]+'</span>'
          }
          if(val[1] == 'priority'){
            setAttrs({'id':val[0],'attrs':{'custom-lz-priority':val[2]}})
          }else{
            setAttrs({'id':val[0],'attrs':{'custom-lz-todo':val[2]}})
          }
        },

        setMemo(id){
          this.$prompt('请输入备注', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            value = value ? value : ''
            setAttrs({'id':id,'attrs':{'memo':value}}).then(()=>{
              let el = document.querySelector('#memo-'+id)
              el.classList.remove('tip-text')
              el.innerHTML = value
            })
          }).catch(()=>false)
        }


  },
}
</script>

<style>

.el-table-filter__bottom button{
  padding: 0 12px !important;
}
</style>
<style scoped>
.title{
  cursor: pointer;
  font-weight: bold;
}
.title:hover span::after{
  content: "  <单击打开>";
  color: #bbb;
  font-weight: normal;
}
.memo{
  cursor: pointer;
}
.tip-text{
  color: transparent;
}
.tip-text:hover{
  color:#ccc;
  cursor: pointer;
}
</style>