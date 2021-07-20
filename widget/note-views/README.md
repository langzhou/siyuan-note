# Note Views

这是一款类似于 Notion Database （当然没那么强悍）的小挂件，它可以自动列出挂件所在（**直接上级**）文件夹中的所有文档，并支持多种视图样式进行展现。

- 前端框架：[Vue.js](https://v3.cn.vuejs.org/)、[Vue-CLI](https://cli.vuejs.org/)
- 插件：[Element（饿了么组件库）](https://element-plus.gitee.io/#/zh-CN)、[vue.draggable.next（看板）](https://github.com/SortableJS/vue.draggable.next)、[axios（网络请求）](https://github.com/axios/axios)
- 开发工具：Visual Studio Code

### 核心功能

1. 支持多种视图（卡片、表格、列表、日历、看板等），可记住上一次选择的视图类型
2. 支持按照文档创建、更新日期正序或倒序排序
3. 支持设置分页大小，并保存设置至块属性
4. 表格视图：支持按照标题排序、支持优先级和待办状态筛选
5. 日历视图：展示每天创建或更新的文档列表，通过圆点颜色表示文档优先级
6. 简单的待办看板：可在看板中直接拖动设置待办状态，也可以在文档属性中添加 `lz-todo` 字段，支持的选项包括：inbox、doing、done、someday（注意小写）
7. 简单的优先级展示：需要手动在文档属性中添加 `lz-priority` 字段，默认支持的选项值为 P0 - P5（注意大写）
8. 支持自定义查询 SQL 语句（20210710 新增）

### 使用方法

1. 下载挂件文件夹**note-views**，并放置在思源笔记 `data/widgets` 目录下，操作后目录结构为 `data/widgets/note-views`
2. 在文档中插入 iframe 内容块（编辑器内输入/iframe）
3. 获得iframe 内容块的 ID，方法：在 iframe 块上 `右键菜单-复制-复制块超链接` 得到链接 `siyuan://blocks/20210512214532-tf8tlbt`，其中 `blocks/` 后的字符串便是内容块ID
4. 设置 iframe 链接：点击 iframe 块图标，在弹出菜单中选择「资源」，在输入框中填入：http://127.0.0.1:6806/widgets/note-views/?blockid=XXX，其中 XXX 为上个步骤中得到的内容块ID
5. 设置完成
6. 如果想要拓展优先级或待办类型的显示，可编辑挂件文件夹下的`config.json`文件，如下所示：
```
{
  "danger":   ["紧急","重要","高优先级","高","high","important"],
  "warning":  ["问题","进行中","中优先级","中","medium"] ,
  "success":  ["完成","低优先级","低","low"],
  "primary":  ["待办","todo"] 
}
```
7. 如果想自定义检索内容（不想展示挂件文件夹下内容），可以点击设置按钮输入 SQL语句。注意：请保持查询结果字段包含 blocks 表头，不然可能会展示失败。
### 更新日志
20210710：支持自定义查询SQL语句、表格视图支持设置待办状态和优先级
### 提示

- 如果文件夹内文档超过 1K+，可能会有一定的加载时长，建议放到文档较少的子文件夹

- 由于 iframe 不支持根据其内嵌内容自动调整宽度，因此首次添加挂件后需要手动调整宽高（右下角那个拖拽手柄）

- 通过 CSS 将 iframe 的边框设为隐藏可提升使用体验（挂件和文档更加融合了有木有）

- 由于官方暂未提供打开文档的API，目前通过**URL Scheme** (siyuan://)实现，可能在一些操作系统上有兼容问题（我猜的）

- 使用看板视图后，会在**文档**中添加`custom-lz-todo-index`属性用于记录排序位置，添加`custom-lz-todo`属性用于保存待办事项状态

- 使用该挂件后，将在挂件所在**内容块**中添加以下属性用来保存用户设置：

   - custom-lz-view-type：视图类型
   - custom-lz-order-type：排序类型
   - custom-lz-order-field：排序字段
   - custom-lz-page-size：分页大小

- 优先级的展示需要手动在**文档**属性中添加`custom-lz-priority`

   
### 预览图

![card](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widget/note-views/preview/card.png) 

![list](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widget/note-views/preview/list.png) 

![table](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widget/note-views/preview/table.png) 

![calendar](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widget/note-views/preview/calendar.png) 

![kanban](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widget/note-views/preview/kanban.png)
