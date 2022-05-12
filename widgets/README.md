# 思源笔记挂件 Widget

- Note Views：笔记视图
- Note Attrs（计划中）：属性面板
- Note Backlink：反链面板
- Little Things：轻量级的日程管理

## Note Views

 各版本下载地址：

 - [v3.0：计划中，更加接近 Notion 的体验]()
 - [v2.0](https://github.com/langzhou/note-views-for-siyuan)
 - [v1.0](https://github.com/langzhou/siyuan-note/tree/main/widgets/note-views)

### 功能概述

1. 数据查询方式

- 子文档：默认的方式，查询挂件所在文档下的子文档（仅查询第一级，不会遍历所有子文档）；
- 自定义 SQL：输入 SQL 语句进行查询。查询结果需要包含 blocks 表中的字段；
- 手动选择文档：支持关键词和文档 ID 搜索（仅支持文档类型）

2. 笔记视图

- 表格视图
- 卡片视图
- 列表视图

3. 笔记字段

- 自动聚合所查询笔记中的所有字段，支持对对字段进行命名、排序、切换可见状态。这些设置均可实现保存。

- 可以将一些常用的字段设置保存在某个挂件中，然后在其他挂件中将其设置为「通用字段」来源（在设置-通用字段中添加该挂件 ID 即可）

4. 筛选排序

- 支持部分系统自动的筛选（正文、创建时间、更新时间、标签等），最多支持 5 个筛选条件，筛选逻辑为「且」，即筛选条件需要同时满足的笔记才会展现；

![pic](https://cdn.jsdelivr.net/gh/langzhou/note-views-for-siyuan/preview.png)

## Note Attrs

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-attrs/preview/note-attrs.png) 

## Note Backlink

支持笔记内插入反链和提及提示，详情请 [点击](https://github.com/langzhou/siyuan-note/tree/main/widgets/note-backlink)。

注意：首次添加挂件时，需要关闭文档重新进入后生效。

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/note-backlink/preview.png) 


## Little Things（暂停更新）

轻量级的事务管理。

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widgets/little-things/preview.png) 



## 提升挂件使用体验的 Tips

隐藏 iframe 边框，缩小挂件缩放手柄，在主题样式中添加一下代码：

```css
.b3-typography iframe, .protyle-wysiwyg iframe {
  border: 0px solid var(--b3-border-color);
}

.protyle-wysiwyg [data-node-id].iframe .protyle-action__drag:after {
  content: "";
  background-color: #eee;
  width: 12px;
  height: 2px;
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 0px;
  box-shadow: none;
  box-sizing: border-box;
  cursor: nwse-resize;
}

.protyle-wysiwyg [data-node-id].iframe .protyle-action__drag {
  height: 12px;
  width: 2px;
  background-color: #eee;
  display: none;
  border-radius: 4px;
  cursor: nwse-resize;
  transition: var(--b3-transition);
  position: absolute;
  right: -4px;
  bottom: 0;
  box-shadow: none;
  box-sizing: border-box;
```