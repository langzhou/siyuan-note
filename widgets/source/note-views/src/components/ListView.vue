<template>
<div id="list-view">
    <div class="list-item" v-for="note in data" :key="note.id" @click="openNote(note.id)">
        <div class="title">{{note.content}} </div>
        <div class="information">
            <el-tag :type="getStyle(note.custom_lz_priority)" size="medium" v-if="note.custom_lz_priority">{{note.custom_lz_priority}}</el-tag>
            <el-tag :type="getStyle(note.custom_lz_todo)" size="medium" v-if="note.custom_lz_todo">{{note.custom_lz_todo}}</el-tag> 
        </div>
    </div>
</div>
</template>

<script>
import {getTagStyle} from '../utils/tools'
export default {
    props:{
        data:null,
    },
    methods:{
        openNote(id) { window.open("siyuan://notes/" + id, "_blank")},
        getStyle(value,type='element'){ return getTagStyle(value,type) },
    },
}
</script>


<style scoped>
.list-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #555;
    border-bottom: 1px solid #f2f2f2;
    padding: 8px 4px;
    cursor:pointer;
}
.list-item:hover{
    background-color: #fafafa;
}
.title{
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
}
.information span{
    margin:0 3px;
}
</style>