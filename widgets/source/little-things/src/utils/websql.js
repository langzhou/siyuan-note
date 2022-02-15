import { systemConfigs } from "./config";
// 创建数据库和表
export function createDataBase(){
    let database = systemConfigs.database
    let table =    systemConfigs.table_name
    try {
      let db = openDatabase(database, '1.0', 'Little Things', 50 * 1024 * 1024);
      db.transaction(function(tr){
        tr.executeSql("create table if not exists "+ table +" (block_id char primary key, content text,content_without_date text, type char, folder_name char, doc_name char, tag char, todo_status char, todo_index int, priority char, priority_index int, created char, created_timestamp int,updated char, updated_timestamp int, start char,start_timestamp int, due char,due_timestamp int)")
              })
      return  db 
    } catch (error) {
      console.log(error)
      alert("数据库初始化失败")
    }
  }

// 更新数据
export function updateLocalData(db, obj){
    const table = systemConfigs.table_name //表名
    let block_id = obj.id
    let data = obj.data
    let insertKeys = ""
    let insertValues = ""
    let updateValues = ""
    // let self = this
    // 遍历对象获得需要更新的 map 值
    let begin = new Date()
    Object.getOwnPropertyNames(data).forEach(function(key){
      // 执行 insert 然后执行 update，模拟 replace 操作但可以避免覆盖
      insertKeys = insertKeys + "," + key
      insertValues = insertValues + ",'" + data[key] + "'"
      if(updateValues == ""){
        updateValues = key + "='" + data[key] + "'"
      }else{
        updateValues = updateValues + "," + key + "='" + data[key] + "'"
      }
    })

    let insertSql = "insert into " + table + " (block_id " + insertKeys + ") values ('" + block_id + "'" + insertValues + ")"
    let updateSql = "update " + table + " set " + updateValues + " where block_id = '" + block_id + "'"
    executeSQL(db, insertSql)
    executeSQL(db, updateSql)
    console.log(insertSql)
    // console.log(updateSql)
    let end = new Date()
    console.log("更新数据到数据库耗时：" + (end.getTime() - begin.getTime()) + " ms")
  }

// 执行 SQL
export function executeSQL(db,sql){
db.transaction(function(tr){
    tr.executeSql(sql)
})
}

// 查询数据
export function queryLocalData(db,sql){
    console.log("查询本地:"+sql)
    let begin = new Date()
    let res = []
    return new Promise((resolve, reject)=>{
        db.transaction(function(tr){
            //参数：sql语句，参数，成功回调，失败回调
            tr.executeSql(sql,[],
                function(tr,result){
                    // console.log("获得本地数据")
                    //转换成数组
                    let len = result.rows.length
                    for (let i = 0; i < len; i++) {
                        let data = result.rows.item(i)
                        res.push(data)
                    }
                    let end = new Date()
                    console.log("查询本地数据耗时：" + (end.getTime() - begin.getTime()) + " ms")
                    resolve(res);
                    },
                    function(error){
                        reject(error);
                    });
   
    }) 
})
}


