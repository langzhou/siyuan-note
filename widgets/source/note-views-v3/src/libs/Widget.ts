import * as Utils from "./../utils/common"
import * as Network from "./../utils/network"
import { Database } from "./Database"
import { ElMessage } from "element-plus"
import { Config, TestMode } from "./../config/config"
import { Collection } from "dexie"
import {
  API,
  Attribute,
  Note,
  AttrOption,
  ViewType,
  DataSource,
  SettingType,
  SettingData,
} from "./Types"

export default class Widget {
  testMode = TestMode
  documentID = ""
  widgetID = ""
  widgetName = "思源笔记"
  widgetNode = document.createElement("div")

  reload = "true" //启动时是否加载最新数据
  viewType = ViewType.Card
  dataSource = DataSource.Subdoc

  // 视图设置
  tableView = {
    tableIndex: "false",
    tableCount: "true",
    tableCountMode: "page",
  }
  cardView = {
    showAttrLabel: "false",
    coverAttr: "title_img",
  }
  listView = {
    showAttrLabel: "false",
  }

  selectedNotes: any[] = []
  excuteSQL = "" //最终执行的SQL语句
  customSQL = "" //用户自定义SQL语句
  pageSize = 10 //分页大小，为 0 时不分页
  currentPage = 1
  sortField = "default" //排序字段
  sortType = "asc" //正倒序
  filters: any[] = [] //筛选条件
  filterMode = "and" //筛选匹配模式，and 全部条件 or 任意条件
  filterOn = "true" //是否开启筛选
  operators: any[] = [] //筛选运算符

  // 笔记和属性
  totalNotes: Note[] = []
  pageNotes: Note[] = []
  sharedAttrs: Attribute[] = []
  widgetAttrs: Attribute[] = [] //挂件笔记集合中的属性
  attributes: Attribute[] = []

  // 页面相关
  loading = false //页面是否加载
  emptyMessage = "😭 未查询到笔记，请检查相关设置"
  dialogVisible = false //弹框显示状态
  dialogType = "" //对话框内容
  showAttrLabel = "false" //卡片模式下属性标签是否显示
  attrFilterReg = "" //通过正则表达式过滤属性
  tableCount = "true" //是否开启表格统计
  tableCountMode = "page" // page or total

  selectSuggestions = [] as any[] //搜索提示

  widgetSetting = {
    widgetName: "思源笔记",
    reload: "true",
    pageSize: 9,
    showAttrLabel: "false", //卡片模式下属性标签是否显示
    attrFilterReg: "", //通过正则表达式过滤属性
    tableCount: "true", //是否开启表格统计
    tableCountMode: "page", // page or total
    tableIndex: "false", //是否显示表格排序
  }

  async init() {
    const res = Utils.getWidgetID() //查询获取挂件 ID

    // 如果是测试环境则采用 mock 数据
    res.code = TestMode ? 1 : res.code
    res.data = TestMode
      ? { id: Config.mock_widget_id, node: document.createElement("div") }
      : res.data

    if (res.code === -1) {
      console.log("获取挂件 ID 失败")
      throw new Error("获取挂件 ID 失败")
    } else {
      // 获取挂件所在文档 ID
      this.widgetID = res.data.id!
      this.documentID = await Utils.getDocumentID(this.widgetID)

      await Database.init(this.widgetID) //初始化数据库

      // 获取IndexeDB中的属性设置
      const widgetAttrs = await Database.widget_attrs
        .where("widget_id")
        .equals(this.widgetID)
        .toArray()

      if (widgetAttrs.length > 0) {
        this.widgetAttrs = widgetAttrs[0]["attrs"]
      }

      // 获取共享属性设置
      this.sharedAttrs = await Database.shared_attrs.toArray()

      // 获取挂件中的设置
      const result = await Network.Siyuan(
        API.GetBlockAttrs,
        {
          id: this.widgetID,
        },
        "获取挂件设置失败，请尝试重新加载"
      )

      if (result.code === 0) {
        this.loadSettings(result.data)
      }
    }
  }

  // 导入设置
  async loadSettings(data: any) {
    this.viewType = data["custom-view-type"] || this.viewType
    this.dataSource = data["custom-data-source"] || this.dataSource
    this.customSQL = Utils.htmlDecode(data["custom-sql"]) || this.customSQL
    this.sortField = data["custom-sort-field"] || this.sortField
    this.sortType = data["custom-sort-type"] || this.sortType
    this.filterOn = data["custom-filter-on"] || this.filterOn
    this.filterMode = data["custom-filter-mode"] || this.filterMode

    this.tableView =
      Utils.praseJSON(Utils.htmlDecode(data["custom-table-view"])) ||
      this.tableView
    this.listView =
      Utils.praseJSON(Utils.htmlDecode(data["custom-list-view"])) ||
      this.listView
    this.cardView =
      Utils.praseJSON(Utils.htmlDecode(data["custom-card-view"])) ||
      this.cardView

    this.selectedNotes =
      Utils.praseJSON(Utils.htmlDecode(data["custom-selected-notes"])) ||
      this.selectedNotes

    this.filters =
      Utils.praseJSON(Utils.htmlDecode(data["custom-filters"])) || this.filters

    // 获取挂件设置（名称、分页等）
    const widget_setting = Utils.praseJSON(
      Utils.htmlDecode(data["custom-setting"])
    )

    this.widgetSetting =
      Utils.praseJSON(Utils.htmlDecode(data["custom-setting"])) ||
      this.widgetSetting

    if (widget_setting) {
      this.reload = widget_setting.reload || this.reload
      this.widgetName = widget_setting.widget_name || this.widgetName
      this.pageSize = widget_setting.page_size || this.pageSize
      this.tableCount = widget_setting.table_count || this.tableCount
      this.tableCountMode =
        widget_setting.table_count_mode || this.tableCountMode
      this.showAttrLabel = widget_setting.show_attr_label || this.showAttrLabel
      this.attrFilterReg = widget_setting.attr_filter || this.attrFilterReg
    }

    // 构造初始化 SQL，默认查询子文档
    if (this.dataSource == "custom_sql") {
      this.createSQL(DataSource.CustomSQL, { custom_sql: this.customSQL })
    } else if (this.dataSource == "selected_notes") {
      this.createSQL(DataSource.SelectedNotes, {
        selected_notes: this.selectedNotes,
      })
    } else {
      this.createSQL(DataSource.Subdoc, { document_id: this.documentID })
    }
  }

  // 构造 SQL 语句
  createSQL(
    type: DataSource,
    data: { document_id?: string; custom_sql?: string; selected_notes?: any[] }
  ) {
    switch (type) {
      // 查询子文档，使用 sql 正则表达式
      case DataSource.Subdoc:
        this.excuteSQL = `select * from blocks where type = 'd' and path REGEXP '/${data.document_id}/[0123456789]{14}-[abcdefghijklmnopqrstuvwxyz0123456789]{7}.sy'`
        break

      // 自定义 SQL
      case DataSource.CustomSQL:
        this.excuteSQL = data.custom_sql!
        break

      // 手动选择笔记
      case DataSource.SelectedNotes: {
        let temp = ""
        const selected_notes = data.selected_notes!

        for (let i = 0; i < selected_notes.length; i++) {
          if (i == selected_notes.length - 1) {
            temp += `'${selected_notes[i].id}'`
          } else {
            temp += "'" + selected_notes[i].id + "',"
          }
        }
        this.excuteSQL = `SELECT * FROM blocks WHERE id IN (${temp})`
        break
      }

      default:
        this.excuteSQL = ""
        break
    }
  }

  // 强制刷新
  async refresh() {
    await this.downloadFromSiyuan()
    //  计算每个筛选项适应的 operator
    if (this.filters.length > 0) {
      this.filters.map((item) => {
        this.operators.push(this.getFilterOperators(item.name))
      })
    }

    await this.fetchLocalNotes()
    this.resizeIframe()
  }

  // 加载笔记
  async loadNotes() {
    if (this.reload == "true") {
      // 存储至缓存数据库
      await this.downloadFromSiyuan()
    } else {
      // 获取 attributes
      const attrs = await Database.widget_attrs
        .where("widget_id")
        .equals(this.widgetID)
        .toArray()

      if (attrs.length > 0) {
        this.widgetAttrs = attrs[0]["attrs"]

        for (const item of this.widgetAttrs) {
          this.getSharedAttrInfor(item)
        }

        this.attributes = this.widgetAttrs
      } else {
        // 如果 indexedDB 中没有记录，则取默认系统属性
        this.attributes = Config.system_attrs
      }
    }

    //  计算每个筛选项适应的 operator
    if (this.filters.length > 0) {
      this.filters.map((item) => {
        this.operators.push(this.getFilterOperators(item.name))
      })
    }

    this.fetchLocalNotes()

    // this.resizeIframe()
  }

  // 获取全局属性中的展示名和类型设置
  getSharedAttrInfor(attr: Attribute): Attribute {
    const attrInShared = this.sharedAttrs.find(
      (item: any) => item.name == attr.name
    )
    if (attrInShared) {
      attr.label = attrInShared.label
      attr.type = attrInShared.type
    }
    return attr
  }

  /**
   * 处理笔记属性：1）正则表达式过滤属性；2）特殊属性处理；3）获取已有的属性设置；4）属性排序
   * @param new_note 要插入数据库的笔记
   * @param attr_name 属性名
   * @param attr_value 属性值
   */
  extractAttrs(new_note: any, attr_name: string, attr_value: any) {
    //正则表达式过滤属性
    const RegString = this.widgetSetting.attrFilterReg
    if (RegString) {
      const reg = new RegExp(RegString)

      if (reg.test(attr_name)) {
        console.log("满足正则表达式", attr_name)
        return
      }
    }

    const attrName = attr_name.replaceAll("-", "_")
    let attrValue = Utils.htmlDecode(attr_value)

    /** 处理特殊属性 **/
    // 1）封面图片
    if (attrName === "title_img") {
      attrValue = attrValue
        .replace("assets/", `${Config.host}/assets/`) //添加绝对地址 TODO:建议在渲染时动态添加 host
        .replace(/background-position:[\s|\S]*?;/gi, "") //去除背景图片位置
        .replace(/min-height:[\s|\S]*?;/gi, "") //去除最小高度
    }

    // 2）创建或更新日期
    if (attrName === "created" || attrName === "updated") {
      attrValue = Utils.siyuanTimeToDateStr(attrValue) //转换日期格式
    }

    // 3）内容块类型
    if (attrName === "type") {
      const block_types = Config.block_types
      attrValue =
        Config.block_types[attrValue as keyof typeof block_types] || "未知类型"
    }

    // 获取已有的属性设置
    const attribute = this.attributes.find((attr) => attr.name === attrName) //属性列表中是否存在该属性
    const attrInSystem = Config.system_attrs.find(
      (attr) => attr.name === attrName
    ) //系统属性列表中是否存在该属性
    const attrInWidget = this.widgetAttrs.find((attr) => attr.name === attrName) //挂件属性列表中是否存在该属性
    const attrInShared = this.sharedAttrs.find((attr) => attr.name === attrName) //全部本地属性列表中是否存在该属性
    // 属性类型
    const attrType = attrInSystem
      ? attrInSystem["type"]
      : attrInShared
      ? attrInShared["type"]
      : "text"

    // 将单选/多选类型的文本值转换为数组
    const valueArray =
      attrType == "select" || attrType == "multi_select"
        ? attrValue.split(",")
        : [attrValue]

    if (attribute) {
      // 如果已存在该属性，则更新
      attribute.count++

      // 统计属性选项值，不存在则添加，避免重复
      if (attrType == "select" || attrType == "multi_select") {
        for (const val of valueArray) {
          if (!attribute.options.find((option: any) => option.value === val)) {
            const range = Math.floor(Math.random() * (5 - 0 + 1)) + 0
            attribute.options.push({
              value: val,
              color: Config.tag_colors[range]["name"],
              hash: Utils.randomWord(true, 4, 4),
            })
          }
        }
      }
    } else {
      // 如果widget_attrs不存在该属性，则添加属性（同时找到之前存储的选项值option配置)）
      let options: any[] = []
      // 只有单选和多选类型会统计属性值
      if (attrType == "select" || attrType == "multi_select") {
        if (attrInWidget) {
          // console.log(attrInWidget)
          //如果是单选、多选，则首先取回已有的 options
          options =
            attrType == "select" || attrType == "multi_select"
              ? attrInWidget.options
              : []
          // 判断新值是否在 options 中，如果不在则添加
          for (const val of valueArray) {
            const option = attrInWidget.options.find(
              (option: any) => option.value === val
            )

            if (!option) {
              const range = Math.floor(Math.random() * (5 - 0 + 1)) + 0
              options.push({
                value: val,
                color: Config.tag_colors[range]["name"], //随机颜色,
                hash: Utils.randomWord(true, 4, 4),
              })
            }
          }
        } else {
          for (const val of valueArray) {
            const range = Math.floor(Math.random() * (5 - 0 + 1)) + 0
            options.push({
              value: val,
              color: Config.tag_colors[range]["name"],
              hash: Utils.randomWord(true, 4, 4),
            })
          }
        }
      }

      // console.log(attr_name, attrInWidget)
      // 存储属性
      this.attributes.push({
        count: 1,
        name: attrName,
        options: options,
        type: attrType,
        label: attrInShared ? attrInShared["label"] : attrName,
        visible: attrInWidget ? attrInWidget["visible"] : false,
        editable: attrInSystem ? attrInSystem["editable"] : true,
        source: attrName.indexOf("custom") > -1 ? "custom" : "system",
        count_type: attrInWidget ? attrInWidget["count_type"] : "none",
        order: attrInWidget
          ? attrInWidget["order"]
            ? attrInWidget["order"]
            : 99
          : 99,
        width: attrInWidget
          ? attrInWidget["width"]
            ? attrInWidget["width"]
            : ""
          : "",
      })
    }

    new_note[attrName] = attrValue
  }

  /**
   * 对属性进行排序
   * @param attrs
   */
  sortAttributes(attrs: Attribute[]) {
    const visibleAttrs: any[] = [],
      unvisibleAttrs: any[] = []

    attrs.forEach((attr: any) => {
      if (attr.visible) {
        visibleAttrs.push(attr)
      } else {
        unvisibleAttrs.push(attr)
      }
    })

    return Utils.arraySort(visibleAttrs).concat(Utils.arraySort(unvisibleAttrs))
  }

  // 存储到本地数据库
  async downloadFromSiyuan() {
    if (!this.excuteSQL) {
      throw new Error("请先设置SQL语句")
    }
    this.loading = true

    await Database.notes.where("widget_id").equals(this.widgetID).delete() // 移除旧数据

    // 开始查询
    const res = await Network.Siyuan(API.QuerySQL, {
      stmt: this.excuteSQL,
    })

    if (res.code == -1) {
      this.loading = false
      return
      // throw new Error("没有查询到数据，请检查相关配置")
    }

    const newNotes: Note[] = []

    for (const note of res.data) {
      const updateDate =
        note.updated != null || note.updated != "" ? note.updated : note.created

      const newNote: any = {
        block_id: note.id,
        widget_id: this.widgetID,
      }

      //汇总笔记ial包含的所有属性
      let res //存储正则匹配结果
      const reg = /([a-z|\d|-]+)="([\S|\s]*?)"/gi //正则匹配 ial 中的属性值
      while ((res = reg.exec(note.ial))) {
        this.extractAttrs(newNote, res[1], res[2])
      }

      // 添加系统默认属性
      Config.system_attrs.forEach((attr) => {
        this.extractAttrs(newNote, attr.name, note[attr.name])
      })

      newNotes.push(newNote)
    }
    // 属性排序
    this.attributes = this.sortAttributes(this.attributes)

    // 变更数据库结构
    await Database.upgrade(this.attributes)
    // 存储属性到 indexedDB
    // Database.widget_attrs.where("widget_id").equals(this.widgetID).delete() // 移除旧数据
    Database.widget_attrs.put(
      {
        widget_id: this.widgetID,
        attrs: JSON.parse(JSON.stringify(this.attributes)),
      },
      this.widgetID
    )
    // 补全属性默认值，然后插入数据库
    newNotes.forEach((note) => {
      // 获取最新的表字段，然后遍历赋值
      const columns = Database.notes.schema.idxByName
      for (const idex in columns) {
        if (!note[idex]) {
          note[idex] = ""
        }
      }
      Database.notes.add(note)
    })

    this.loading = false
  }

  // 查询本地数据
  async fetchLocalNotes() {
    this.loading = true

    let collcetion: Collection
    let filterSQL = `note.widget_id == '${this.widgetID}' `

    if (this.sortField != "default") {
      collcetion = Database.notes.orderBy(this.sortField)
    } else {
      collcetion = Database.notes.toCollection()
    }

    let condition = ""
    // 构建筛选条件
    if (this.filters.length > 0) {
      for (const [index, filter] of this.filters.entries()) {
        const filterOperator = filter.operator
        const filterValue = `'${filter.value}'`
        const attrType = Utils.getAttrType(filter.name, this)
        const logic = index == 0 ? "" : this.filterMode == "and" ? "&&" : "||"

        // 判断运算符是否存在
        const sysOperator = Config.filter_operators.find(
          (item: any) => item.name == filterOperator
        )
        if (!sysOperator) {
          ElMessage.warning("部分筛选运算符错误，查询时将会被忽略")
          console.log(`运算符[${filterOperator}]不存在`)
          continue
        }
        // 判断运算符是否支持该属性类型
        if (sysOperator.attr_types.indexOf(attrType) == -1) {
          ElMessage.warning("部分筛选条件错误，查询时将会被忽略")
          console.log(`属性类型[${attrType}]不支持运算符[${filterOperator}]`)
          continue
        }

        // 筛选条件合法，开始构建筛选语句
        // console.log(typeof filterValue)

        if (filter.operator == "contains") {
          condition += ` ${logic} note.${filter.name}.indexOf(${filterValue}) > -1 `
        } else if (filter.operator == "not_contains") {
          condition += ` ${logic} note.${filter.name}.indexOf(${filterValue}) == -1 `
        } else if (filter.operator == "empty") {
          condition += ` ${logic} note.${filter.name} == '' `
        } else if (filter.operator == "not_empty") {
          condition += ` ${logic} note.${filter.name} != '' `
        } else if (filter.operator == "checked") {
          condition += ` ${logic} note.${filter.name} == 'true' `
        } else if (filter.operator == "not_checked") {
          condition += ` ${logic} (note.${filter.name} == '' || note.${filter.name} == 'false') `
        } else {
          condition += ` ${logic} note.${filter.name} ${sysOperator.operator} ${filterValue}`
        }
      }
    }

    if (condition != "" && this.filterOn == "true") {
      filterSQL += ` && (${condition})`
    }

    console.log("筛选条件: " + filterSQL)

    // 尝试执行筛选语句，如果报错，则执行不带筛选的查询
    try {
      collcetion.filter((note) => eval(filterSQL))
    } catch (error) {
      collcetion.filter((note) => eval(`note.widget_id == '${this.widgetID}'`))
      ElMessage.error("筛选语句错误，已恢复默认筛选")
    }

    // 正倒序
    if (this.sortType == "asc") {
      this.totalNotes = await collcetion.toArray()
    } else {
      this.totalNotes = await collcetion.reverse().toArray()
    }

    if (this.totalNotes.length == 0) {
      // 精细化错误提示
      let msg = "查询结果为空"
      if (this.filters.length > 0 && this.filterOn == "true") {
        msg += " | 请检查筛选条件是否正确"
      }
      if (this.dataSource == DataSource.Subdoc && this.filters.length == 0) {
        msg += " | 未检索到子文档"
      }
      if (this.dataSource == DataSource.CustomSQL) {
        msg += " | 请检查 SQL 语句是否正确"
      }
      if (
        this.dataSource == DataSource.SelectedNotes &&
        this.selectedNotes.length == 0
      ) {
        msg += "| 未选择笔记"
      }

      ElMessage.warning(msg)
      this.pageNotes = []
    } else {
      // 计算分页
      this.pageNotes =
        this.widgetSetting.pageSize > 0
          ? this.totalNotes.slice(0, this.widgetSetting.pageSize)
          : this.totalNotes
    }

    this.loading = false
  }

  /** 属性设置的相关处理流程  */

  //在 IndexedDB 中保存属性属性名称、类型
  async saveAttrInfor(attr: Attribute) {
    Database.shared_attrs.put(JSON.parse(JSON.stringify(attr)), attr.name)
    // 切换成单选、多选时，统计选项值
    if (attr.type == "select" || attr.type == "multi_select") {
      this.computeSelectOptions(attr.name)
    } else {
      // 如果变更为非单选多选类型时需要清空选项，则去除注释
      // attr.options = []
      // this.saveWidgtAttrs()
      console.log("变更属性类型为：" + attr.type)
    }
  }

  /**
   * 更新块属性
   * @param blockID 内容块 ID
   * @param blockType 块类型
   * @param attrName 属性名
   * @param attrValue 属性值
   * @param self widget 对象
   */
  async saveAttrValue(
    blockID: string,
    blockType: string,
    attrName: string,
    attrValue: any,
    self = this
  ) {
    const key = attrName, //用于保存至 IndexedDB
      key2 = attrName.replaceAll("_", "-"),
      data = {} as any,
      data2 = {} as any

    attrValue = typeof attrValue == "number" ? String(attrValue) : attrValue // 将数字转换为字符串
    data[key as keyof typeof data] = attrValue
    data2[key2 as keyof typeof data2] = attrValue

    //  text 类型没有双向绑定，需要手动保存到 totalnote
    const note = this.totalNotes.find((note) => note.block_id == blockID)
    if (note) {
      note[key as keyof typeof note] = attrValue
    }

    // 保存到 indexedDB
    Database.notes.update([self.widgetID, blockID], data)

    // 保存到思源笔记
    if (attrName == "content") {
      // this.updateBlock(blockID, attrValue)
      await Network.Siyuan(API.UpdateBlock, {
        dataType: "markdown",
        data: attrValue,
        id: blockID,
      })
    } else {
      await Network.Siyuan(API.SetBlockAttrs, {
        id: blockID,
        attrs: data2,
      })
      // console.log(res)
    }
    // console.log("saveAttrValue", blockID, attrName, attrValue)
  }

  // 保存属性列表到 indexedDB
  async saveWidgtAttrs(self = this) {
    // 获取排序位置
    for (const [index, attr] of this.attributes.entries()) {
      attr.order = index + 1
    }

    // 属性排序
    this.attributes = this.sortAttributes(this.attributes)

    // 存储到 indexedDB
    Database.widget_attrs.put(
      {
        widget_id: self.widgetID,
        attrs: JSON.parse(JSON.stringify(self.attributes)),
      },
      self.widgetID
    )
  }

  // 修改属性 options
  async updateAttrOptions(type: string, attrName: string, value: any) {
    console.log(type, attrName, value)
  }

  // 移除共享属性
  async removeSharedAttr(attr: Attribute, index: number, self = this) {
    // await Database.upgrade([attr], "remove") //变更数据库结构 Todo：移除后可能会影响索引

    await Database.shared_attrs.delete(attr.name) //删除共享属性

    // 移除 widget.attributes 中的属性
    const attribute = self.attributes.find((item) => item.name == attr.name)
    if (attribute) {
      console.log(attribute)
      // self.attributes.splice(self.attributes.indexOf(attribute), 1)
      attribute.label = ""
      attribute.type = "text"
    } else {
      console.log("attributes 中未找到对应属性字段")
    }

    self.saveWidgtAttrs(self)

    // 移除 widget.sharedattrs 中的属性
    self.sharedAttrs.splice(index, 1)
    ElMessage.success("属性已移除")
  }

  // 保存设置
  async saveSettings(type: SettingType, data: SettingData, self = this) {
    this.dialogVisible = false //关闭对话框

    switch (type) {
      case SettingType.ViewType:
        self.viewType = data.view_type!

        Network.Siyuan(API.SetBlockAttrs, {
          id: self.widgetID,
          attrs: {
            "custom-view-type": self.viewType,
          },
        })

        break

      // 这里只需要处理设置为子文档的场景，其他场景已经由对话框返回时处理了
      case SettingType.DataSource:
        self.dataSource = data.data_source!

        if (self.dataSource == DataSource.Subdoc) {
          // 将执行 SQL 设置为查询子文档
          self.createSQL(DataSource.Subdoc, { document_id: self.documentID })
          // 重新下载远程数据
          await self.downloadFromSiyuan()
        }

        break

      case SettingType.CustomSQL: {
        const res = await Network.Siyuan(API.SetBlockAttrs, {
          id: this.widgetID,
          attrs: {
            "custom-data-source": DataSource.CustomSQL,
            "custom-sql": data.custom_sql,
          },
        })
        if (res.code == 0) {
          self.dataSource = DataSource.CustomSQL
          self.customSQL = data.custom_sql!
          self.excuteSQL = self.customSQL
          await self.downloadFromSiyuan()
        }

        break
      }

      // 保存用户手动选择的笔记，只存 id 和 content
      case SettingType.SelectedNotes: {
        const res = await Network.Siyuan(API.SetBlockAttrs, {
          id: this.widgetID,
          attrs: {
            "custom-data-source": DataSource.SelectedNotes,
            "custom-selected-notes": JSON.stringify(
              self.filterSelectedNotes(data.selected_notes)
            ),
          },
        })

        if (res.code == 0) {
          self.dataSource = DataSource.SelectedNotes
          self.selectedNotes = data.selected_notes!
          self.createSQL(DataSource.SelectedNotes, {
            selected_notes: data.selected_notes,
          })

          await self.downloadFromSiyuan()
        }

        break
      }

      case SettingType.SharedAttrs:
        // this.saveWidgtAttrs()
        console.log("saveSharedAttrs", this.sharedAttrs)
        for (const item of this.sharedAttrs) {
          console.log(item)
          Database.shared_attrs.put(JSON.parse(JSON.stringify(item)), item.name)
        }
        break

      // 保存排序项
      case SettingType.Sort:
        Network.Siyuan(API.SetBlockAttrs, {
          id: this.widgetID,
          attrs: {
            "custom-sort-type": self.sortType,
            "custom-sort-field": self.sortField,
          },
        })
        break

      // 保存筛选项
      case SettingType.Filters: {
        Network.Siyuan(API.SetBlockAttrs, {
          id: this.widgetID,
          attrs: {
            "custom-filters": JSON.stringify(self.filters),
            "custom-filter-on": self.filterOn,
            "custom-filter-mode": self.filterMode,
          },
        })

        break
      }

      case SettingType.TableView: {
        const res = await Network.Siyuan(API.SetBlockAttrs, {
          id: this.widgetID,
          attrs: {
            "custom-table-view": JSON.stringify(data),
          },
        })

        if (res.code == 0) {
          self.tableView.tableIndex = data.tableIndex!
          self.tableView.tableCount = data.tableCount!
          self.tableView.tableCountMode = data.tableCountMode!
        }
        break
      }

      case SettingType.ListView: {
        const res = await Network.Siyuan(API.SetBlockAttrs, {
          id: this.widgetID,
          attrs: {
            "custom-list-view": JSON.stringify(data),
          },
        })

        if (res.code == 0) {
          self.listView.showAttrLabel = data.showAttrLabel!
        }
        break
      }
      case SettingType.CardView: {
        const res = await Network.Siyuan(API.SetBlockAttrs, {
          id: this.widgetID,
          attrs: {
            "custom-card-view": JSON.stringify(data),
          },
        })

        if (res.code == 0) {
          self.cardView.showAttrLabel = data.showAttrLabel!
          self.cardView.coverAttr = data.coverAttr!
        }
        break
      }

      // 保存挂件设置
      case SettingType.WidgetSetting: {
        const res = await Network.Siyuan(API.SetBlockAttrs, {
          id: this.widgetID,
          attrs: {
            "custom-setting": JSON.stringify(data),
          },
        })

        if (res.code == 0) {
          // self.widgetSetting = data
          self.widgetSetting.reload = data.reload!
          self.widgetSetting.widgetName = data.widgetName!
          self.widgetSetting.pageSize = data.pageSize!
          self.widgetSetting.tableCount = data.tableCount!
          self.widgetSetting.tableCountMode = data.tableCountMode!
          self.widgetSetting.tableIndex = data.tableIndex!
          self.widgetSetting.showAttrLabel = data.showAttrLabel!
          self.widgetSetting.attrFilterReg = data.attrFilterReg!
        }

        break
      }
    }

    // 保存数据后统一刷新页面数据

    self
      .fetchLocalNotes()
      .then()
      .catch((error) => {
        self.loading = false
        ElMessage.error(error.message)
      })
  }

  // 手动添加的笔记中只将 id 和 content 属性存储到挂件中
  filterSelectedNotes(notes: Note[]) {
    const selectedNotes = []
    for (const note of notes) {
      selectedNotes.push({
        id: note.id,
        content: Utils.cutString(note.content, 20),
      })
    }
    return selectedNotes
  }

  // 动态计算筛选属性对应的运算符
  handleFilterNameChange(attrName: string, index: number, self = this) {
    // 获取适配新筛选属性的 operator列表
    const operators = self.getFilterOperators(attrName)
    self.operators[index] = operators
    // 筛选属性变了，之前存储的 operator 也要变
    self.filters[index]["operator"] = operators[0]["name"]
    self.filters[index]["value"] = ""
    // 保存筛选条件到思源笔记
    self.saveSettings(SettingType.Filters, { data: "null" })
    this.fetchLocalNotes()
  }

  // 新增筛选项
  appendFilterItem(self = this) {
    if (self.filters.length > 5) {
      ElMessage.error("最多只能添加5个筛选条件")
      return
    }
    self.filters.push({
      name: "content",
      operator: "contains",
      value: "",
    })
    self.operators.push(self.getFilterOperators("content"))
  }

  // 移除筛选项
  removeFilterItem(index: number, self = this) {
    self.filters.splice(index, 1)
    self.fetchLocalNotes()
  }

  // 获取筛选属性的 operator 列表
  getFilterOperators(attrName: string) {
    const array = []
    const attribute = this.attributes.find((attr) => attr.name == attrName)
    // console.log(attribute, attrName)
    if (attribute) {
      for (const item of Config.filter_operators) {
        if (item.attr_types.indexOf(attribute.type) > -1) {
          array.push(item)
        }
      }
    }
    return array
  }

  // 查询下拉框搜索建议
  getSelectSuggestions(keyword: string, attrName: string, self = this) {
    self.selectSuggestions = [] //先清空候选列表
    // type 属性特殊处理，需要映射显示名称
    const array = [] as any[]

    const attribute = self.attributes.find((attr) => attr.name == attrName)
    if (attribute && attribute.options.length > 0) {
      const options = attribute.options //获取到属性字段的值列表
      if (keyword) {
        let equal = "null"
        for (const key in options) {
          const option = options[key as keyof typeof options]
          if (option.value.indexOf(keyword) > -1) {
            array.push({
              label: option.value,
              value: option.value,
            })
          }
          if (option.value == keyword) {
            equal = "equal"
          }
        }
        // 如果没有匹配到或者精准匹配，则添加关键词本身到候选列表
        if (array.length == 0 || equal == "null") {
          array.unshift({
            label: keyword,
            value: keyword,
          })
        }
        self.selectSuggestions = array
      } else {
        self.selectSuggestions = options
      }
    }
    // }
  }

  // 更新选项信息：名称、颜色、移除
  updateOptionInfor(
    attrName: string,
    option: { value: any; color: string; hash: string },
    data: any,
    action: string,
    self = this
  ) {
    // console.log(attrName, option, data, action)
    switch (action) {
      case "delete": {
        console.log("delete")
        const index = data.options.findIndex(
          (item: any) => item.value == option.value
        )
        data.options.splice(index, 1)
        self.saveWidgtAttrs()
        break
      }
      //  todo：检查属性值是否重复
      case "check": {
        const attr = self.attributes.find((attr) => attr.name == attrName)
        if (attr) {
          console.log(option.value)
          console.log(JSON.stringify(attr.options))
        }
        break
      }
      case "value": {
        // option.value = data //更新缓存内的值

        const attr = self.attributes.find((attr) => attr.name == attrName)
        if (attr) {
          attr.options.forEach((item: any) => {
            if (item.hash == option.hash) {
              item.value = option.value
              self.saveWidgtAttrs()
            }
          })
        }

        break
      }
      case "color": {
        option.color = data //更新缓存内的值

        // 更新 attributes 中的颜色
        const attr = self.attributes.find((attr) => attr.name == attrName)
        if (attr) {
          attr.options.forEach((item) => {
            if (item.value == option.value) {
              item.color = data
            }
          })

          // 更新到 widget_attrs
          self.saveWidgtAttrs()
        }

        break
      }
    }
  }

  /**
   * 设置单选、多选值
   * @param attr 属性字段
   * @param note 笔记
   * @param data 传参
   * @param type 单选 | 多选
   * @param action add | remove
   */
  chooseSelectOption(
    attr: Attribute,
    note: Note,
    data: any,
    type = "select",
    action = "add"
  ) {
    const values = Utils.toArray(note[attr.name])

    if (action == "add") {
      const option = data

      if (values.indexOf(option.value) > -1) {
        ElMessage.warning(`"${option.value}" 已经存在`)
      } else {
        // 如果是单选则替换，如果是多选则追加
        if (type == "select") {
          note[attr.name] = option.value
        } else {
          note[attr.name] = note[attr.name]
            ? note[attr.name] + "," + option.value
            : option.value
        }
        // 保存到 IndexedDB，如果不存在则添加
        const res = attr.options.find((item) => item.value == option.value)
        if (!res) {
          attr.options.push(data)
          this.saveWidgtAttrs()
        }
      }
    } else {
      // 移除选项值
      const index = values.indexOf(data)
      if (index > -1) {
        values.splice(index, 1)
      }
      note[attr.name] = values.join(",")
    }
  }

  // 当属性类型变更为单选、多选时，更新属性options的值
  async computeSelectOptions(attrName: string, refresh = false) {
    let newOptions = [] as AttrOption[]
    const attribute = this.attributes.find((attr) => attr.name == attrName)

    if (!attribute) {
      ElMessage.warning(`属性 ${attrName} 不存在`)
      return
    }

    for (const note in this.totalNotes) {
      const value = this.totalNotes[note][attrName]
      // 只处理值不为空的情况
      if (value) {
        const valueArray = value.split(",")
        const attrInWidget = this.widgetAttrs.find(
          (item) => item.name == attrName
        )

        //如果不强制刷新，则先取出之前的选项值
        if (attrInWidget && !refresh) {
          newOptions = attrInWidget.options
        }

        for (const val of valueArray) {
          const range = Math.floor(Math.random() * (5 - 0 + 1)) + 0
          const option = newOptions.find((item) => item.value == val)
          if (!option) {
            newOptions.push({
              value: val,
              color: Config.tag_colors[range]["name"],
              hash: Utils.randomWord(true, 4, 4),
            })
          }
        }
      }
    }

    attribute!.options = newOptions
    console.log(newOptions)

    // 更新到 widget_attrs
    this.saveWidgtAttrs()
  }

  // 响应分页
  changePage(currentPage: number) {
    this.currentPage = currentPage
    this.pageNotes = this.totalNotes.slice(
      (currentPage - 1) * this.widgetSetting.pageSize,
      currentPage * this.widgetSetting.pageSize
    )
  }

  // 清理缓存
  async clearDatabase() {
    await Database.notes.clear()
    await this.init()
    await this.downloadFromSiyuan()
    await this.fetchLocalNotes()
    ElMessage.success("缓存已清理")
  }

  // 调整表格列宽
  async resizeTableWidth(data: any) {
    const attr = this.widgetAttrs.find((attr) => attr.name === data.attrName)
    if (attr) {
      attr.width = data.newWidth
    }
    Database.widget_attrs.update(this.widgetID, {
      attrs: JSON.parse(JSON.stringify(this.widgetAttrs)),
    })
  }

  // 根据内容调整 iframe 高度
  resizeIframe() {
    const iframe = window.frameElement as HTMLIFrameElement
    const height = window.document.body.scrollHeight
    iframe.style.height = height + 50 + "px"
    // console.log(height)
  }

  async changeViewType(type: ViewType) {
    this.viewType = type
    if (type == ViewType.Table) {
      // 不重新加载 el-table textarea 会撑开
      this.loadNotes()
    }

    Network.Siyuan(API.SetBlockAttrs, {
      id: this.widgetID,
      attrs: {
        "custom-view-type": type,
      },
    })
  }
}
