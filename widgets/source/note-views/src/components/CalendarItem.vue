<template>
    <div>
        <div class="note" v-for="note in listData" :key="note.id" @click="openNote(note.id)">
            <div class="circle" >
                <span class="circle_inner" :style="getStyle(note.custom_lz_priority)"></span>
            </div>
            <div class="title">{{note.content}}</div>
        </div>
        <span class="more" v-if="num != 0">有 <strong>{{num}}</strong> 条笔记未展示</span>
    </div>
</template>

<script>
import {getTagStyle} from '../utils/tools'
export default {
    props:{
        data: null,
        num: null, //有多少笔记未展示
        maxShow: null, //每个日期单元格最多展示多少条
    },
    computed:{
        listData(){
            // max 为日历单元格最多显示的条目
            const max = this.maxShow
            let data = this.data
            let slicedData = null
            if(data && data.length){
                if(data.length > max){
                    slicedData = data.slice(0,max)
                }else{
                    slicedData = this.data
                }
            }
            return slicedData
        }
    },

    methods:{
        openNote(id) { window.open("siyuan://blocks/" + id, "_blank")},
        getStyle(value,type='priority'){ return getTagStyle(value,type) },
    }

}
</script>

<style scoped>

.note{
    font-size: 14px;
    margin: 2px 3px;
    padding: 2px 0;
    display: flex;
    align-items: flex-start;
}
.title{
    line-height: 20px;
}
.title:hover{
    color: #409eff;
    cursor: pointer;
}
.circle{
    width:16px;
    height:20px;
    display: flex;
    align-items: center;
    justify-content:center;
    flex-shrink:0;
}
.circle_inner{
     border-radius: 6px;
     width: 6px;
     height: 6px;
     flex-shrink:0;
}
.more{
    font-size: 13px;
    background-color: #efefef;
    color: #999;
    border-radius: 5px;
    padding: 2px 5px;
    
}
</style>