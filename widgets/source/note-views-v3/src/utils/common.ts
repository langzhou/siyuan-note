import { Config } from "../config/config"
import * as Network from "./network"
import { API } from "@/libs/Types"
import Widget from "@/libs/Widget"

// 打开笔记
export const openNote = (id: string) => {
  window.open("siyuan://blocks/" + id, "_blank")
}

// 将,分隔转换为数组
export const toArray = (value: any) => {
  if (value) {
    return String(value).split(",")
  } else {
    return []
  }
}

//从 Markdown 超链中提取内容块信息。示例文本：[爱的艺术](siyuan://blocks/20210222174714-7hz5wop) 
export const parseBlockLink = (str: string) => {
  if (!str) {
    return []
  } else {
    // const reg = /(\[(\S*)\]\(siyuan:\/\/blocks\/(\d{14}-\w{7})\))/gi
    const reg = /(\[(\S*)\]\((\S*?)\))/gi
    let res
    const arr = [] as any[]
    while ((res = reg.exec(str))) {
      console.log(res)
      const a = `<a href="siyuan://blocks/${res[3]}" target="_blank">${res[2]}</a>`
      arr.push(a)
    }
    // console.log(res)
    return arr
  }
}

// 将任意类型转成 boolean
export const toBoolean = (value: any) => {
  const type = typeof value
  if (type === "boolean") {
    return value
  } else if (type === "string") {
    return value === "true" || value === "1" || value === "yes"
  } else if (type === "number") {
    return value === 1
  } else {
    return false
  }
}
// 获取标签颜色
export const tagStyle = (value: string, attrName: string, attrs: any) => {
  const attribute = attrs.find((attr: any) => attr.name == attrName)

  if (attribute) {
    const options = attribute.options
    const option = options.find((option: any) => option.value == value)

    if (option) {
      return option.color
    } else {
      return "grey"
    }
  } else {
    return "grey"
  }
}

// 根据 color 返回 style 样式字符串
export const selectOptionStyle = (colorName: string) => {
  const color = Config.tag_colors.find((item: any) => item.name == colorName)
  if (color) {
    return `background: ${color.background};color: ${color.color};`
  } else {
    return "color: rgb(111, 113, 115);background-color: rgba(162, 164, 166, 0.2);"
  }
}

/**
 * 复制纯文本到剪贴板
 * @param {string} text
 */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error("Failed to copy: ", err)
  }
}

/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 ** xuanfeng 2014-08-28
 */
export const randomWord = (randomFlag: boolean, min: number, max: number) => {
  let str = "",
    range = min

  const arr = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ]

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

// 字符串拼接
export const stringPin = (...strs: any) => {
  if (strs.length === 0) {
    return ""
  } else {
    const str = strs.reduce((pre: any, cur: any) => {
      return String(pre) + String(cur)
    })
    return str
  }
}

// 换行符替换
export const ReplaceBR = (str: string, new_str: string) => {
  return str.replace(/[\r\n]+/g, new_str)
}

// 空白字符替换
export const ReplaceSpace = (str: string, new_str: string) => {
  return str.replace(/\s+/g, new_str)
}

export const friendlyTime = (timestamp: number) => {
  if (!timestamp) return ""

  const now = new Date()
  const thisYear = now.getFullYear()
  const noteYear = new Date(timestamp).getFullYear()
  if (thisYear == noteYear) {
    return timestampFormat(timestamp, "M月d日 hh:mm:ss")
  } else {
    return timestampFormat(timestamp, "yyyy年M月d日 hh:mm:ss")
  }
}

// 官方字符串转成日期格式字符串
export const siyuanTimeToDateStr = (str: string) => {
  return str.replace(
    /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
    "$1-$2-$3 $4:$5:$6"
  )
}

// 官方日期字符串转成时间戳
export const siyuanTimeToTimestamp = (str: string) => {
  try {
    return new Date(siyuanTimeToDateStr(str)).getTime()
  } catch {
    return 0
  }
}

export const siyuanTimeToDate = (str: string) => {
  return new Date(siyuanTimeToDateStr(str))
}

// 时间戳转成日期格式字符串
export const timestampFormat = (timestamp: number, fmt: string) => {
  return dateFormat(new Date(timestamp), fmt)
}

export const siyuanTimeFormat = (str: string, fmt: string) => {
  return dateFormat(new Date(siyuanTimeToTimestamp(str)), fmt)
}

/**
 * 日期格式化
 * @param date
 * @param fmt yyyy-MM-dd hh:mm:ss 2022-07-08 17:23:29
 * @returns
 */
export const dateFormat = (date: Date, fmt: string) => {
  const o: { [x: string]: any } = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    )
  for (const k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      )
  return fmt
}

/**
 * 字符串截取
 * @param str
 * @param len
 * @returns
 */
export const cutString = (str: string, len: number) => {
  if (str.length > len) {
    return str.substr(0, len) + "..."
  } else {
    return str
  }
}

/**
 * 将字符串转换成 json 对象
 * @param str
 * @returns
 */
export const praseJSON = (str: string | undefined) => {
  if (str) {
    try {
      // console.log(JSON.parse(str))
      return JSON.parse(str)
    } catch (error) {
      console.log(`JSON 解析失败: ${str}`)
      return false
    }
  } else {
    // console.log("JSON解析失败：参数为空")
    return false
  }
}

/**
 * HTML 反转义
 * @param str
 * @returns
 */
export const htmlDecode = (str: string) => {
  try {
    let temp = ""
    if (str.length == 0) return ""
    temp = str.replace(/&amp;/g, "&")
    temp = temp.replace(/&lt;/g, "<")
    temp = temp.replace(/&gt;/g, ">")
    temp = temp.replace(/&nbsp;/g, " ")
    temp = temp.replace(/&#39;/g, "'")
    temp = temp.replace(/&quot;/g, '"')
    return temp
  } catch (error) {
    return ""
  }
}

interface Sortable {
  order: string | number
}
/**
 * 对对象数组进行排序(从小到大），对象需遵循 sortable 协议，拥有 order 属性(string | number)
 * @param arr 待排序数组
 * @returns
 */
export const arraySort = <obj extends Sortable>(arr: Array<obj>) => {
  const tempArray = arr
  const len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      const orderOfA = tempArray[j]["order"]
      const orderOfB = tempArray[j + 1]["order"]
      let a = typeof orderOfA == "string" ? parseInt(orderOfA) : orderOfA
      let b = typeof orderOfB == "string" ? parseInt(orderOfB) : orderOfB
      a = a ? a : 0
      b = b ? b : 0
      if (a > b) {
        //相邻元素两两比较
        const temp = tempArray[j + 1] //元素交换
        tempArray[j + 1] = tempArray[j]
        tempArray[j] = temp
      }
    }
  }
  return tempArray
}

/**
 * 简单搜索文档：通过正文关键词或文档 ID
 * @param keyword 关键词 或 blockid
 * @param limit 限制数量
 * @returns
 */
export const miniSearch = (keyword: string, limit = 50) => {
  return Network.Siyuan(API.QuerySQL, {
    stmt: `select * from blocks where (content like '%${keyword}%' or id = '${keyword}') and type = 'd' limit ${limit}`,
  })
}

export const getWidgetID = () => {
  const iframe = window.frameElement
  const parent = iframe?.parentElement?.parentElement
  if (parent != null) {
    return {
      code: 0,
      data: {
        id: parent.dataset.nodeId,
        node: parent,
      },
    }
  } else {
    return {
      code: -1, //失败
      data: {},
    }
  }
}

export async function getDocumentID(blockID: string) {
  // console.log("getDocumentID", blockID)
  const { code, msg, data } = await Network.Siyuan(API.QuerySQL, {
    stmt: `SELECT root_id FROM blocks WHERE id = '${blockID}'`,
  })
  if (code === 0 && data.length > 0) {
    return data[0].root_id
  } else {
    return ""
  }
}

export const getAttrType = (attrName: string, widget: Widget) => {
  const attribute = widget.attributes.find((item) => item.name === attrName)
  if (attribute) {
    return attribute.type
  } else {
    return "text"
  }
}
