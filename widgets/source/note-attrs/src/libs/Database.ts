import { Config } from "@/config/config"
import Dexie, { Table } from "dexie"
import { Attribute } from "./Types"

export default class IndexedDB extends Dexie {
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
  }

  async init() {
    if (!(await Dexie.exists("NoteViews"))) {
      console.log("初始化 IndexedDB 数据库")
      this.version(0.1).stores(this.defaultSchema)
      await this.open()
      // 插入默认数据
      for (const attr in Config.system_attrs) {
        await this.shared_attrs.add(Config.system_attrs[attr])
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
}

export const Database = new IndexedDB()
