# Note Views v3.0

## Beta 版本体验

下载 [note-views-v3-beta](https://github.com/langzhou/siyuan-note/tree/main/widgets/note-views-v3/build)，将其放置在思源笔记 widgets 文件夹即可。

**使用需知：**

- 第一次加载挂件时会提示查询数据为空，可尝试重新载入笔记；
- 初始设置为查询子文档，所以如果挂件所在文档没有子文档时也是查询不出数据的；
- 表格视图初始状态下所有字段的「显示」均为否，所以也没有数据展示。可点击「字段」按钮，设置需要显示的字段；
- 大部分系统属性不支持编辑（在表格视图下表头带红点的即是系统属性），另外文档的标签和内容块的标签在思源笔记里是以不同方式处理的，如果需要筛选内容块的标签，可以直接将筛选条件设置为：「正文」包含#标签#，而不是将「标签」字段设置为包含 XX；
- note views 最初设计的出发点是用于展示文档，如果把它用来查询/展示内容块或者 SQL 过于复杂时可能会出现不可预知的问题。


## 功能概述

### 1. 视图

目前支持表格、卡片、列表视图，后续计划支持看板、日历视图。

- 表格视图：支持表格统计、自定义列宽、行序号等，支持对属性值的修改，比如可以直接修改标签；
- 卡片视图
- 列表视图

### 2. 字段属性

- 支持对自定义属性进行命名（展示名称）
- 支持设置属性类型，包括：文本、数字、日期、图片、单选、多选、评星、勾选框等
- 单选或多选：支持设置选项值颜色

### 3. 筛选

- 支持所有自定义属性的筛选，并根据属性类型展示不同的筛选操作
- 支持多个筛选条件的组合
- 支持 全部 或 任意 的筛选逻辑

### 4. 排序

- 支持所有自定义属性的排序（只支持单个属性的排序，不支持组合排序）


## 预览

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-views-v3/preview/card-view.png)

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-views-v3/preview/table-view.png)

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-views-v3/preview/table-view-2.png)

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-views-v3/preview/list-view.png)

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-views-v3/preview/multi-select.png)

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-views-v3/preview/attrs.png)

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-views-v3/preview/filter.png)