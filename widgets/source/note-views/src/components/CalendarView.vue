<template>
<div id="calendar-view">
    <el-calendar>
        <template #dateCell="{data}">
            <div>{{ data.day.split('-').slice(2).join('') }}</div>
            <calendar-item :data="getData(data.day,'data')" :num="getData(data.day,'num')" :maxShow="maxShow"></calendar-item>
        </template>
    </el-calendar>
</div>
</template>

<script>
import CalendarItem   from './CalendarItem.vue'
export default {
    components:{
        CalendarItem
    },
    data(){
        return{
            maxShow:10, //设置每个日期单元格最多展示多少条笔记
        }
    },
    props:{
        data: Array,
        orderField: String, //决定是按照创建日期还是更新日期展示日历
    },

    methods:{
        // 取出日期当天的数据 @type：取文档数据 or 取文档总数
        getData(queryDate,type){
            let tempData   = null
            let tempNumber = null
            let data = this.parseData(this.data)

            queryDate = queryDate.replace(/-/g,"") //删除传入参数中的-
            let hasDate = Object.prototype.hasOwnProperty.call(data,queryDate)
            if (hasDate){
                tempNumber = data[queryDate]['num']
                tempData   = data[queryDate]['data']

                if(tempNumber > this.maxShow){
                    tempNumber = tempNumber - this.maxShow
                }else{
                    tempNumber = 0
                }
            }else{
                tempData   = null
                tempNumber = 0
            }

           if(type == "data"){ 
               return tempData
           }else{
               return tempNumber
           }
        },

        // 从父级获得数据后按照日期进行分类，生成对象然后等待下一步按照日期调取
        parseData(data){
            
            let newData = {}
            let tempDate = ""
            for (let i = 0; i < data.length; i++) {
                // 截取日期
                if(this.orderField == "created"){
                    tempDate = data[i].created.substring(0,8)
                }else{
                    tempDate = data[i].updated.substring(0,8)
                }
                // 没有日期信息则统一归入 none
                if(tempDate == "--"){tempDate = "none"}
                
                let hasDate = Object.prototype.hasOwnProperty.call(newData,tempDate)
                if (hasDate){
                    let number  = newData[tempDate]['num']
                    let doc     = newData[tempDate]['data']
                    doc[number] = data[i]
                    number++
                    newData[tempDate]={num:number,data:doc}
                } else {
                    let doc = [data[i]]                 
                    newData[tempDate]={num: 1,data:doc}   
                }   
            }
            return newData
        },

    },

}
</script>

<style>
.el-calendar-table .el-calendar-day{
    min-height: 90px;
    height: 100% !important;
}
</style>
<style scoped>
.list-item{
    position: relative;
    padding-left: 14px;
    font-size: 14px;
}
.list-item::before{
    content: "";
    width: 8px;
    height: 8px;
    background-color: #DDD;
    border-radius: 6px;
    position: absolute;
    top: 5px;
    left: 0;
}
.list-item.low::before{
    background-color: rgb(18, 173, 122);
}
.list-item.medium::before{
    background-color: rgb(168, 114, 12);
}
.list-item.high::before{
    background-color: rgb(153, 55, 17);
}
</style>

