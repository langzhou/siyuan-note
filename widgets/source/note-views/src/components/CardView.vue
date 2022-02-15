<template>
<div id="card-view">
    <div class="list">
        <div class="card" v-for="note in data" :key="note.id" @click="openNote(note.id)">
            <el-card :body-style="{padding:'0px'}" shadow="hover">
                <div class="cover" :style="note.cover">
                </div>
                <div class="note-content">
                    <div class="title">{{note.content}}</div>
                    <div class="date">创建日期：{{note.new_created}}</div>
                    <div class="date">更新日期：{{note.new_updated}}</div>
                    <el-tag class="tag" :type="getStyle(note.custom_lz_todo)" size="small" effect="dark" v-if="note.custom_lz_todo">{{note.custom_lz_todo}}</el-tag> 
                    <el-tag class="tag" :type="getStyle(note.custom_lz_priority)" size="small" effect="dark" v-if="note.custom_lz_priority">{{note.custom_lz_priority}}</el-tag>
                </div>
            </el-card>
        </div>
    </div>
</div>
</template>

<script>
import {getTagStyle} from '../utils/tools'
export default {
    props:{
        data: null,
    },
    methods:{
        openNote(id) { window.open("siyuan://blocks/" + id, "_blank")},
        getStyle(value,type='element'){ return getTagStyle(value,type) }
    },
}
</script>

<style scoped>
#card-view{
    display: flex;
    justify-content: center;
}
.list{
    display: flex;
    flex-wrap: wrap;
}
.card{
    width: 300px;
    margin: 6px 4px;
    cursor: pointer;
}
.cover{
    height: 150px;
    background-position: center;
    background-size: cover;
    background-color: #EEE;
    position: relative;
}
.note-content{
    padding: 12px 14px;
}
.title{
    font-size: 16px;
    font-weight: bold;
    color: #444;
    height: 2em;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
}
.date{
    color: #777;
    height: 20px;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    margin-bottom:4px;
}
.tag{
    margin-right: 10px;
}
</style>