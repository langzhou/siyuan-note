import { Config } from "@/config/config"
import Dexie, { Table } from "dexie"
import { Note, Attribute } from "./Types"

export default class IndexedDB extends Dexie {
  notes!: Table<Note>
  shared_attrs!: Table<Attribute>
  widget_attrs!: Table<{ widget_id: string; attrs?: any }>

  // 默认表结构
  defaultSchema = {
    notes:
      "[widget_id+block_id], id, content, title, alias, created, updated, title_img, tags, hpath, box, memo, type",
    shared_attrs: "&name, label, type",
    widget_attrs: "&widget_id, attrs",
  }

  constructor() {
    super("NoteViews")
    // this.init()
  }

  async init(widgetID = "") {
    if (!(await Dexie.exists("NoteViews"))) {
      console.log("初始化 IndexedDB 数据库")
      this.version(0.1).stores(this.defaultSchema)
      await this.open()

      // 插入默认数据
      for (const attr in Config.system_attrs) {
        await this.shared_attrs.add(Config.system_attrs[attr])
      }
      // 下面这些也是系统属性，但可能包含在 ial 中，所以没有放置在 system_attrs 中
      await this.shared_attrs.add({
        name: "tags",
        label: "文档标签",
        type: "multi_select",
        source: "system",
        visible: false,
        options: [],
        count_type: "none",
      })

      await this.shared_attrs.add({
        name: "title",
        label: "文档标题",
        type: "text",
        source: "system",
        visible: false,
        options: [],
        count_type: "none",
      })

      await this.shared_attrs.add({
        name: "title_img",
        label: "题头图",
        type: "img",
        source: "system",
        visible: false,
        options: [],
        count_type: "none",
      })

      if (widgetID) {
        await this.widget_attrs.add({
          widget_id: widgetID,
          attrs: [
            {
              count: 0,
              label: "正文",
              name: "content",
              source: "system",
              type: "text",
              options:[],
              visible: true,
              count_type:'total_count'
            },
            {
              count: 0,
              label: "创建时间",
              name: "created",
              source: "system",
              type: "date",
              options:[],
              visible: true,
            },{
              count: 0,
              label: "内容块类型",
              name: "type",
              source: "system",
              type: "select",
              options:[],
              visible: true,
            },
          ],
        })
      }
    } else {
      // 先打开数据库获取版本号
      await this.open()
      const version = this.verno
      const currentSchema = this.tables.reduce(
        (result: any, { name, schema }) => {
          result[name] = [
            schema.primKey.src,
            ...schema.indexes.map((idx) => idx.src),
          ].join(",")
          return result
        },
        {}
      )
      this.close()
      this.version(version).stores(currentSchema)
      await this.open()
    }
  }

  /**
   * 变更数据库结构
   * @param columns 表字段
   * @param action  add | remove
   */
  async upgrade(columns: Attribute[], action = "add") {
    await this.init()

    // 获取到 notes 表
    const notesTable = this.tables.find((item) => item.name == "notes")!
    let schema = notesTable.schema.primKey.src
    let newSchema = "",
      removeColumns = ""

    if (action == "add") {
      // 新增属性
      columns.forEach((column) => {
        // 判断是否存在
        if (column.name in notesTable.schema.idxByName == false) {
          console.log(`变更IndexedDB: 新增 ${column.name} 属性`)
          newSchema += ", " + column.name
        }
      })
    } else {
      // 移除属性
      notesTable.schema.indexes.forEach((item) => {
        // 如果不在 columns 中，则保留该属性
        if (!columns.find((column) => column.name == item.name)) {
          newSchema += ", " + item.name
        } else {
          removeColumns += ", " + item.name
          console.log(`变更IndexedDB: 移除 ${item.name} 属性`)
        }
      })
    }

    if (
      (action == "add" && newSchema != "") ||
      (action != "add" && removeColumns != "")
    ) {
      if (action == "add") {
        // 获取之前的表结构
        for (const item of notesTable.schema.indexes) {
          schema += ", " + item.name
        }
      }

      newSchema = schema + newSchema
      console.log("变更IndexedDB: " + newSchema)

      this.close()
      this.version(this.verno + 0.1).stores({
        notes: newSchema,
        shared_attrs: "&name,label,type",
        widget_attrs: "&widget_id,attrs",
      })

      await this.open()
    }
  }
}

export const Database = new IndexedDB()
