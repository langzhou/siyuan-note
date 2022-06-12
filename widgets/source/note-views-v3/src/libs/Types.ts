export enum API {
  SetBlockAttrs = "set_block_attrs",
  GetBlockAttrs = "get_block_attrs",
  UpdateBlock = "update_block",
  QuerySQL = "query_sql",
}

export interface ResponseData {
  code: number
  data: any
  msg: string
}

export type RequestData =
  | SQLRequest
  | SetBlockAttrsRequest
  | GetBlockAttrsRequest
  | UpdateBlockRequest

export interface SetBlockAttrsRequest {
  id: string
  attrs: { [key: string]: any }
}

export interface GetBlockAttrsRequest {
  id: string
}

export interface UpdateBlockRequest {
  dataType: string
  data: string
  id: string
}

export interface SQLRequest {
  stmt: string
}

export interface Note {
  block_id: string
  content: string
  type: string
  hpath: string
  markdown?: string
  created: string
  updated?: string
  alias?: string
  title?: string
  name?: string
  hash?: string
  order?: number
  tags?: string
  [attr: string | number]: any //支持添加动态属性
}

export interface Attribute {
  name: string // 属性名
  label: string // 属性展示名称
  type: string //字段类型
  visible: boolean // 是否可见
  options: any[] // 属性值
  order?: number // 排序
  source: string // 字段来源
  count_type: string //统计类型
  [attr: string | number]: any //支持添加动态属性
}

export interface AttrOption{
  value: any,
  color:string,
  hash:string
}

export enum DataSource {
  Subdoc = "subdoc", //子文档
  CustomSQL = "custom_sql", //自定义SQL
  SelectedNotes = "selected_notes", //用户手动选择的笔记
}

// 视图类型
export enum ViewType {
  Table = "table-view",
  List = "list-view",
  Card = "card-view",
  Calendar = "calendar-view",
  Kanban = "kanban-view",
}

// 设置类型
export enum SettingType {
  DataSource = "data_source",
  ViewType = "view_type",
  CustomSQL = "custom_sql",
  SelectedNotes = "selected_notes",
  SharedAttrs = "shared_attrs",
  Sort = "sort",
  Filters = "filters",
  WidgetSetting = "widget_setting",
  TableView  = "table_view",
  ListView = "list_view",
  CardView = "card_view",
}

export interface SettingData {
  view_type?: ViewType
  data_source?: DataSource
  custom_sql?: string
  selected_notes?: any
  widgetName?: string
  pageSize?: number
  tableCount?: string
  tableCountMode?: string
  tableIndex?:string
  showAttrLabel?: string
  attrFilterReg?: string
  reload?:string
  coverAttr?: string
  data?:any
}

export interface ViewTypeSetting {
  view_type: string
}
export interface DataSourceSetting {
  data_source: string
}
