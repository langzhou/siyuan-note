export enum API {
  SetBlockAttrs = "set_block_attrs",
  GetBlockAttrs = "get_block_attrs",
  UpdateBlock = "update_block",
  QuerySQL = "query_sql",
  PrependBlock = "prepend_block",
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
  | PrependlockRequest

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

export interface PrependlockRequest {
  dataType: string
  data: string
  parentID: string
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
  show?: boolean //是否显示
  visible?: boolean // 是否可见
  options?: any[] // 属性值
  order?: number // 排序
  source?: string // 字段来源
  [attr: string | number]: any //支持添加动态属性
}

export interface AttrOption {
  value: any
  color: string
  hash: string
}
