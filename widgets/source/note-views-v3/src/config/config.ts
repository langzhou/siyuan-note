import { API } from "./../libs/Types"
export const TestMode = 0 //测试环境 1 线上环境 0

export const Config = {
  
  host: TestMode ? "http://127.0.0.1:6806" : "",

  mock_widget_id: "20210813151137-w8rymj0", //测试 id

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
  ],

  // 筛选比较符
  filter_operators: [
    {
      name: "not_empty",
      label: "已填写",
      operator: "!=",
      attr_types: [
        "text",
        "number",
        "img",
        "date",
        "select",
        "multi_select",
        "checkbox",
        "rate",
      ],
    },
    {
      name: "empty",
      label: "未填写",
      operator: "==",
      attr_types: [
        "text",
        "number",
        "img",
        "date",
        "select",
        "multi_select",
        "checkbox",
        "rate",
      ],
    },
    {
      name: "is",
      label: "是",
      operator: "==",
      attr_types: ["text", "date", "select", "multi_select", "rate", "img"],
    },
    {
      name: "is_not",
      label: "不是",
      operator: "!=",
      attr_types: ["text", "date", "select", "multi_select", "rate", "img"],
    },
    {
      name: "contains",
      label: "包含",
      operator: "like",
      attr_types: ["text", "select", "multi_select", "img"],
    },
    {
      name: "not_contains",
      label: "不包含",
      operator: "not like",
      attr_types: ["text", "select", "multi_select", "img"],
    },
    {
      name: "checked",
      label: "已勾选",
      operator: "==",
      attr_types: ["checkbox"],
    },
    {
      name: "not_checked",
      label: "未勾选",
      operator: "!=",
      attr_types: ["checkbox"],
    },
    {
      name: "earlier_than",
      label: "早于",
      operator: "<",
      attr_types: ["date"],
    },
    {
      name: "later_than",
      label: "晚于",
      operator: ">",
      attr_types: ["date"],
    },
    {
      name: "equal",
      label: "=",
      operator: "==",
      attr_types: ["number"],
    },
    {
      name: "not_equal",
      label: "≠",
      operator: "!=",
      attr_types: ["number"],
    },
    {
      name: "larger_than",
      label: ">",
      operator: ">",
      attr_types: ["number"],
    },
    {
      name: "larger_or_equal",
      label: "≥",
      operator: ">=",
      attr_types: ["number"],
    },
    {
      name: "smaller_than",
      label: "<",
      operator: "<",
      attr_types: ["number"],
    },
    {
      name: "smaller_or_equal",
      label: "≤",
      operator: "<=",
      attr_types: ["number"],
    },
  ],

  // 筛选运算符
  filter_operators2: {
    是: {
      name: "是",
      value: "==",
      types: ["text", "date"],
    },
    不是: {
      name: "不是",
      value: "!=",
      types: ["text", "date"],
    },
    包含: {
      name: "包含",
      value: "==",
      types: ["text"],
    },
    不包含: {
      name: "不包含",
      value: "!=",
      types: ["text"],
    },
    早于: {
      name: "早于",
      value: "<",
      types: ["date"],
    },
    晚于: {
      name: "晚于",
      value: ">",
      types: ["date"],
    },
    "=": {
      name: "=",
      value: "==",
      types: ["number"],
    },
    "≠": {
      name: "≠",
      value: "!=",
      types: ["number"],
    },
    ">": {
      name: ">",
      value: ">",
      types: ["number"],
    },
    "<": {
      name: "<",
      value: "<",
      types: ["number"],
    },
  },

  // 单选多选项颜色
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

  // 可用于筛选的系统属性（必须是 IndexedDB 索引里有的字段）
  filter_names: [
    { name: "正文", field: "content", type: "text" },
    { name: "目录", field: "hpath", type: "text" },
    { name: "创建时间", field: "created", type: "date" },
    { name: "更新时间", field: "updated", type: "date" },
    { name: "类型", field: "type", type: "text" },
    { name: "标签", field: "tags", type: "text" },
  ],
  // 属性类型
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

  // 内容块类型
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

  // 表格统计类型
  count_types: {
    common: {
      none: "不展示",
      total_count: "总记录",
      unique: "唯一值",
      with_value: "已填写",
      without_value: "未填写",
      null_percent: "为空占比",
      not_null_percent: "非空占比",
    },
    number: {
      sum: "总和",
      avg: "平均值",
      max: "最大值",
      min: "最小值",
      range: "范围",
    },
    checkbox: {
      done: "已完成",
      undone: "未完成",
    },
    date: {
      most_early: "最早",
      most_late: "最晚",
    },
  },

  // 系统属性，由于不在 ial 字段中，所以需要手动添加进来
  system_attrs: [
    {
      name: "content",
      label: "正文",
      type: "text",
      source: "system",
      editable: true,
      visible: true,
      options: [],
      count_type: "none",
    },
    {
      name: "markdown",
      label: "Markdown",
      type: "text",
      source: "system",
      editable: true,
      visible: true,
      options: [],
      count_type: "none",
    },
    {
      name: "hpath",
      label: "目录",
      type: "text",
      source: "system",
      editable: false,
      visible: true,
      options: [],
      count_type: "none",
    },

    {
      name: "type",
      label: "内容块类型",
      type: "select",
      source: "system",
      editable: false,
      visible: true,
      options: [],
      count_type: "none",
    },

    {
      name: "box",
      label: "笔记本 ID",
      type: "text",
      source: "system",
      editable: false,
      visible: false,
      options: [],
      count_type: "none",
    },
    {
      name: "created",
      label: "创建时间",
      type: "date",
      source: "system",
      editable: false,
      visible: true,
      options: [],
      count_type: "none",
    },
  ],
}
