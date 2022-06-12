import { API } from "./../libs/Types"
export const TestMode = 0 //测试环境 1 线上环境 0

export const Config = {
  host: TestMode ? "http://127.0.0.1:6806" : '',

  mock_widget_id: "20220504142602-he95vh1", //测试 id

  // 思源笔记 api 请求类型
  api: [
    {
      name: "查询SQL",
      type: API.QuerySQL,
      url: "/api/query/sql",
    },
    {
      name: "设置属性",
      type: API.SetBlockAttrs,
      url: "/api/attr/setBlockAttrs",
    },
    {
      name: "获取属性",
      type: API.GetBlockAttrs,
      url: "/api/attr/getBlockAttrs",
    },
    {
      name: "更新块",
      type: API.UpdateBlock,
      url: "/api/block/updateBlock",
    },
    {
      name: "插入前置子块",
      type: API.PrependBlock,
      url: "/api/block/prependBlock",
    },
  ],

  tag_colors: [
    {
      name: "red",
      color: "rgb(152, 13, 15)",
      background: "rgba(203, 64, 66, 0.2)",
    },
    {
      name: "blue",
      color: "rgb(0, 118, 172)",
      background: "rgba(46, 169, 223, 0.2)",
    },
    {
      name: "green",
      color: "rgb(0, 78, 11)",
      background: "rgba(27, 129, 62, 0.2)",
    },
    {
      name: "yellow",
      color: "rgb(204, 145, 0)",
      background: "rgba(255, 196, 8, 0.2)",
    },
    {
      name: "orange",
      color: "rgb(198, 88, 0)",
      background: " rgba(249, 139, 42, 0.2)",
    },

    {
      name: "brown",
      color: "rgb(65, 52, 11)",
      background: "rgba(116, 103, 62, 0.2)",
    },
    {
      name: "purple",
      color: " rgb(55, 25, 105)",
      background: "rgba(106, 76, 156, 0.2)",
    },
    {
      name: "grey",
      color: "rgb(111, 113, 115)",
      background: "rgba(162, 164, 166, 0.2)",
    },
  ],

  attr_types: [
    { name: "text", value: "文本" },
    { name: "number", value: "数字" },
    { name: "date", value: "日期" },
    { name: "rate", value: "评分" },
    { name: "select", value: "单选" },
    { name: "multi_select", value: "多选" },
    { name: "checkbox", value: "勾选框" },
    { name: "img", value: "图片" },
    { name: "url", value: "网址链接" },
  ],

  block_types: {
    doc: "文档",
    d: "文档",
    h: "标题",
    l: "列表",
    i: "列表项",
    c: "代码",
    m: "数学公式",
    p: "段落",
    t: "表格",
    s: "超级块",
    html: "HTML",
    widget: "挂件",
    iframe: "iframe",
    query_embed: "嵌入块",
    video: "视频",
  },

  uneditable_attrs: ["id","created","updated","title_img"],

  system_attrs: [
    {
      name: "created",
      label: "创建时间",
      type: "date",
      source: "system",
    },
    {
      name: "updated",
      label: "更新时间",
      type: "date",
      source: "system",
    },
    {
      name: "title_img",
      label: "题头图",
      type: "img",
      source: "system",
    },
    {
      name: "tags",
      label: "文档标签",
      type: "multi_select",
      source: "system",
    },
    {
      name: "title",
      label: "文档标题",
      type: "text",
      source: "system",
    },
    {
      name: "alias",
      label: "别名",
      type: "text",
      source: "system",
    },
    {
      name: "name",
      label: "命名",
      type: "text",
      source: "system",
    },
  ],
}
