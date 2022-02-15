import Dexie from 'dexie';
import DateUtil from './date'
export class Database extends Dexie {
  constructor() {
    super('database');
    // 建表
    this.version(2).stores({
      todos: '&block_id, raw_content, pure_content, box, folder, doc, type, created, created_stamp, updated, updated_stamp, todo, priority, todo_index, priority_index, due, due_stamp,done,done_stamp',
    });
    this.todos = this.table('todos');

    // 日期相关
    this.today          = new Date(new Date().toLocaleDateString()).getTime()
    this.tomorrow       = DateUtil.DateUtil.getTomorrowDay('date').getTime()
    this.afterTomorrow  = DateUtil.DateUtil.getAfterTomorrowDay('date').getTime()
    this.weekStart      = DateUtil.DateUtil.getStartDayOfWeek('date').getTime()
    this.weekEnd        = DateUtil.DateUtil.getEndDayOfWeek('date').getTime()
    this.monthStart     = DateUtil.DateUtil.getStartDayOfMonth('date').getTime()
    this.monthEnd       = DateUtil.DateUtil.getEndDayOfMonth('date').getTime()

  }
  // 查询
  async getTodos(where, order) {
    let todoList      = ['inbox','doing','done','someday']
    let priorityList  = ['P0','P1','P2','P3']
    // let dateList      = ['today','tomorrow','week','month']   
    let filter   
    let today         = this.today
    let tomorrow      = this.tomorrow
    let afterTomorrow = this.afterTomorrow
    let weekStart     = this.weekStart
    let weekEnd       = this.weekEnd
    let monthStart    = this.monthStart
    let monthEnd      = this.monthEnd

    where = where ? where : 'all'
    order = order ? order : 'updated_stamp'

    if(order == 'custom'){
      if(todoList.includes(where))    {order = 'todo_index'}else
      if(priorityList.includes(where)){order = 'priority_index'}else{
        order = 'updated_stamp'
      }
    }


    switch (where) {
      case 'done':
        filter = item => item.todo == 'done'
        break
      case 'today':
        filter = item => item.due_stamp >= today      && item.due_stamp < tomorrow      && item.todo != 'done'
        break;
      case 'tomorrow':
        filter = item => item.due_stamp >= tomorrow   && item.due_stamp < afterTomorrow && item.todo != 'done'
        break
      case 'week':
        filter = item => item.due_stamp >= weekStart  && item.due_stamp < weekEnd       && item.todo != 'done'
        break
      case 'month':
        filter = item => item.due_stamp >= monthStart && item.due_stamp < monthEnd      && item.todo != 'done'
        break
      default:
        filter = item => item.todo != 'done'
        break;
    }

    if(['inbox','doing','someday'].includes(where)){ filter = item => item.todo == where }
    if(['P0','P1','P2','P3'].includes(where))      { filter = item => item.priority == where && item.todo != 'done' }

    if(order == 'created_stamp' || order == 'updated_stamp'){
      return  await this.todos.orderBy(order).filter(filter).reverse().toArray() //倒序
    } else{
      return  await this.todos.orderBy(order).filter(filter).toArray()
    }
   
    
  }

  async getCounts(type){
    let counts 
    if(['inbox','doing','someday'].includes(type)){
      counts = await this.todos.where({todo:type}).and((item)=> item.todo != 'done').count()  
    } 
    if(['P0','P1','P2','P3'].includes(type)){
      counts = await this.todos.where({priority:type}).and((item)=> item.todo != 'done').count() 
    } 
    if(type == 'done'){
      counts = await this.todos.where({todo: 'done'}).count() 
    } 
    if(type == 'today'){
      counts = await this.todos.filter((item) => item.due_stamp >= this.today && item.due_stamp < this.tomorrow && item.todo != 'done').count() 
    } 
    if(type == 'tomorrow'){
      counts = await this.todos.filter((item) => item.due_stamp >= this.tomorrow && item.due_stamp < this.afterTomorrow && item.todo != 'done').count() 
    } 
    if(type == 'week'){
      counts = await this.todos.filter((item) => item.due_stamp >= this.weekStart && item.due_stamp < this.weekEnd && item.todo != 'done').count() 
    } 
    if(type == 'month'){
      counts = await this.todos.filter((item) => item.due_stamp >= this.monthStart && item.due_stamp < this.monthEnd && item.todo != 'done').count() 
    }
    if(type == 'all'){
      counts = await this.todos.filter((item)=> item.todo != 'done').count()
    }

    return counts
    
  }

  setTodoStatus(block_id,value) {
    return this.todos.update(block_id, {todo: value})
  }

  addTodo(data) {
    return this.todos.add(data)
  }

  updateTodo(block_id,data){
    return this.todos.update(block_id,data)
  }

  deleteTodo(todoID) {
    return this.todos.delete(todoID);
  }

  // 更新 todo 排序位置
  setTodoIndex(block_id, index){
    return this.todos.update(block_id,{ todo_index: index ? index : 0})
  }
  // 更新优先级排序位置
  setPriorityIndex(block_id, index){
    return this.todos.update(block_id, { priority_index: index ? index : 0})
  }

}

