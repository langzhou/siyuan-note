import * as Utils from "./../utils/common"
import * as Network from "./../utils/network"
import { Attribute } from "./Types"
import { Config, TestMode } from "./../config/config"
import { Database } from "./Database"
import { ElMessage } from "element-plus"
import { API } from "./../libs/Types"

export default class Widget {
  widgetID = ""
  documentID = ""
  sharedAttrs: any[] = []
  attributes: any[] = []
  // dialogVisible = false

  createAttrs: Attribute[] = []
  selectAttrs: Attribute[] = []

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
      await Database.init() //初始化数据库
      // 获取共享属性设置
      this.sharedAttrs = await Database.shared_attrs.toArray()

      // 获取挂件中的设置
      const result = await Network.Siyuan(
        API.GetBlockAttrs,
        { id: this.documentID },
        "获取挂件设置失败，请尝试重新加载"
      )

      if (result.code == 0) {
        await this.loadSettings(result.data)
      }
    }
  }

  // 初次安装时需要重新获取 ID
  // async initID() {
  //   this.widgetID = Utils.getWidgetID().data.id!
  //   this.documentID = await Utils.getDocumentID(this.widgetID)
  // }

  // 导入设置
  async loadSettings(data: any) {
    if (!data) {
      ElMessage.warning("属性为空")
      return
    }
    // console.log(data)

    // 获取属性排序信息
    const docAttrs = data["custom-doc-attrs"]
      ? JSON.parse(Utils.htmlDecode(data["custom-doc-attrs"]))
      : []

    for (const key in data) {
      const attrName = key.replaceAll("-", "_")
      const attrValue = Utils.htmlDecode(data[key])
      const attrInDoc = docAttrs.find((item: any) => item.name === attrName)
      const attrInShared = this.sharedAttrs.find(
        (item) => item.name === attrName
      )

      // console.log(attrInDoc, attrName)

      const newAttr = {
        name: attrInShared ? attrInShared.name : attrName,
        label: attrInShared ? attrInShared.label : "",
        type: attrInShared ? attrInShared.type : "text",
        order: attrInDoc ? attrInDoc.order : 99,
        source: attrName.indexOf("custom") > -1 ? "custom" : "system",
        value: attrValue,
        show: attrInDoc  && attrInDoc.show != undefined ? attrInDoc.show : true,
      }

      // 部分属性不展示出来
      if (
        [
          "custom_doc_attrs",
          "id",
          "title_img",
          "title",
          "icon",
          "type",
        ].indexOf(attrName) == -1
      ) {
        this.attributes.push(newAttr)
      }
    }
    this.attributes = Utils.arraySort(this.attributes)
  }

  // 保存属性基本信息
  async saveAttrInfor(attr: any) {
    // console.log(attr)
    Database.shared_attrs.put({
      name: attr.name,
      label: attr.label,
      type: attr.type,
    })
  }

  // 保存属性排序
  async saveAttrsOrder(self = this) {
    const array: { name: string; order: string | number; show: boolean }[] = []
    for (const [index, attr] of this.attributes.entries()) {
      attr.order = index
      array.push({
        name: attr.name,
        order: index,
        show: attr.show,
      })
    }
    Network.Siyuan(API.SetBlockAttrs, {
      id: self.documentID,
      attrs: {
        "custom-doc-attrs": JSON.stringify(array),
      },
    })
  }

  // 保存属性值
  async saveAttrValue(attr: Attribute, self = this) {
    const data = {} as any
    const key = attr.name.replaceAll("_", "-")
    const value =
      typeof attr.value == "number" ? String(attr.value) : attr.value
    data[key] = value

    Network.Siyuan(API.SetBlockAttrs, {
      id: self.documentID,
      attrs: data,
    })
  }

  // async changeAttrLabel(index: number, attr: Attribute) {
  //   console.log(index, attr)
  //   this.attributes[index] = { ...attr }
  // }

  // 检查属性格式是否正确
  checkAttrFormat(attr: Attribute, nullCheck = false) {
    attr.name = attr.name.trim()
    attr.value = String(attr.value).trim()

    // 是否检查空值
    if (nullCheck) {
      if (attr.name == "") {
        ElMessage.warning("请输入属性名")
        return false
      }
      if (attr.value == "") {
        ElMessage.warning("请输入属性值")
        return false
      }
    }

    // 校验属性名
    const patt = /^[a-z0-9]+[-_]?[a-z0-9-_]*$/
    // console.log(patt.test(attr.name))
    if (!patt.test(attr.name) && attr.name) {
      ElMessage.warning(`${attr.name}: 属性名格式不正确`)
      return false
    }

    return true
  }

  // 添加自定义属性
  appendAttr(type = "create", self = this) {
    if (type == "create") {
      self.createAttrs.push({
        name: "",
        label: "",
        type: "text",
        order: 99,
        value: "",
        show: true,
      })
    } else {
      self.selectAttrs.push({
        name: "",
        label: "",
        type: "text",
        order: 99,
        value: "",
        show: true,
      })
    }
  }

  // 删除自定义属性
  async removeAttr(attr: Attribute, index: number, self = this) {
    if (attr.name.indexOf("custom") == -1) return
    const data = {} as any
    const key = attr.name.replaceAll("_", "-")
    data[key] = ""
    const res = await Network.Siyuan(API.SetBlockAttrs, {
      id: this.documentID,
      attrs: data,
    })

    if (res.code == 0) {
      self.attributes.splice(index, 1)
    }
  }

  // 保存新属性属性
  async saveNewAttr(type: string, index: number, attr: Attribute, self = this) {
    // console.log(type, attr, index)

    attr.name = attr.name.trim()
    attr.label = attr.label.trim() || attr.name

    // 属性校验
    if (!self.checkAttrFormat(attr, true)) return

    // 将数值转换为字符串
    if (typeof attr.value == "number") {
      attr.value = String(attr.value).trim()
    }

    // 如果类型为多选，需要将中文逗号转换为英文逗号
    if (attr.type == "multi_select") {
      attr.value = attr.value.replaceAll("，", ",")
    }

    // 如果手动创建，且属性名未包含 custom，则自动添加 custom- 前缀
    if (type == "create" && attr.name.indexOf("custom") == -1) {
      attr.name = "custom-" + attr.name
    }

    // 保存新属性
    const key = attr.name.replaceAll("_", "-").trim()
    attr.order = self.attributes.length + 1
    const data = {} as any
    data[key] = attr.value.trim()
    // console.log(data)
    const res = await Network.Siyuan(API.SetBlockAttrs, {
      id: self.documentID,
      attrs: data,
    })

    // 保存失败的处理
    if (res.code == -1) {
      ElMessage.warning(res.msg)
      return
    }

    // 保存成功的处理
    attr.name = attr.name.replaceAll("-", "_")
    self.attributes.push(attr) // 添加到属性列表
    self.saveAttrsOrder() // 保存属性顺序

    // 添加到 shared_attrs
    await Database.shared_attrs.put({
      name: attr.name,
      label: attr.label,
      type: attr.type,
    })

    if (type == "create") {
      // 从候选中移除
      self.createAttrs.splice(index, 1)
    } else {
      // 从候选中移除
      self.selectAttrs.splice(index, 1)
    }
  }

  // 选择已有的属性后，需要更新类型和名称
  async selectAttrName(attr: Attribute, index: number, self = this) {
    const attrInShared = self.sharedAttrs.find(
      (item) => item.name === attr.name
    )
    if (attrInShared) {
      self.selectAttrs[index].type = attrInShared.type
      self.selectAttrs[index].label = attrInShared.label
    }
  }

  // 新增多选项
  async appendSelectItem(attr: Attribute, value: string) {
    attr.value = attr.value ? attr.value + "," + value : value
    this.saveAttrValue(attr)
  }

  // 删除多选项
  async removeSelectItem(attr: Attribute, attrName: string, self = this) {
    const array = Utils.toArray(attr.value)
    // console.log(array)
    if (array.indexOf(attrName) > -1) {
      array.splice(array.indexOf(attrName), 1)
      attr.value = array.join(",")
      console.log(attr)
      self.saveAttrValue(attr, self)
    }
  }

  // 将属性插入到文档中
  async downloadAttrs(self = this) {
    if (!self.documentID) {
      ElMessage.warning("首次安装后，请重新载入笔记")
      return
    }

    let markdown = ""
    for (const key in self.attributes) {
      const attr = self.attributes[key]
      markdown += `**${attr.label || attr.name}：** ${attr.value}\n\n`
    }

    Network.Siyuan(API.PrependBlock, {
      data: markdown,
      dataType: "markdown",
      parentID: self.documentID,
    })
  }
}
