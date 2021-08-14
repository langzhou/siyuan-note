# Little Things

 基于思源笔记的极其轻量级的事务管理工具，它主要实现的功能是：把分散在文档各处的具有待办状态的内容块聚合起来。

- 前端框架：[Vue.js](https://v3.cn.vuejs.org/)、[Vue-CLI](https://cli.vuejs.org/)
- 插件：[Element（饿了么组件库）](https://element-plus.gitee.io/#/zh-CN)、[axios（网络请求）](https://github.com/axios/axios)、[Dexie.js（IndexedDB 数据库）](https://dexie.org/)、vue3-context-menu（右键菜单）
- 开发工具：Visual Studio Code

### 核心功能

1. 支持待办事项的聚合展现，包括待办状态、日期、优先级清单视图
2. 支持按照优先级、更新日期、创建日期排序
3. 可右键菜单设置待办状态和优先级，或者直接鼠标勾选为已完成状态
4. 报告统计：doing

### 使用方法

1. 下载挂件文件夹**little-things**，并放置在思源笔记 `data/widgets` 目录下
2. 在文档中插入 iframe 内容块（编辑器内输入/iframe）
3. 获得iframe 内容块的 ID，方法：在 iframe 块上 `右键菜单-复制-复制块超链接` 得到链接 `siyuan://blocks/20210512214532-tf8tlbt`，其中 `blocks/` 后的字符串便是内容块ID
4. 设置 iframe 链接：点击 iframe 块图标，在弹出菜单中选择「资源」，在输入框中填入：http://127.0.0.1:6806/widgets/little-things/?blockid=XXX，其中 XXX 为上个步骤中得到的内容块ID
5. 设置完成后挂件将自动搜索其所在文件夹下所有文档中带有待办状态的内容块
6. 设置待办状态的几种方法：
 - 直接在内容块中输入`@todo`
 - 内容块输入`@yyyymmdd`或者`@yyyy-mm-dd`，即可识别为截止日期。建议结合模板快捷输入，比如创建`@today`的模板，快捷的插入当前日期
 - 打开 内容块属性面板，待办事项请添加属性`lz-todo`，支持的类型包括 inbox、doing、someday、done，优先级请输入`lz-priority`，支持的类型包括 P0-P3
7. 结合 **toy** 主题可以在文档中直观的看到待办和优先级状态

### 提示

- 如果待办事项超过一定数量（具体多少没测过），可能会有一定的加载时长，建议定期清理已完成的事项


   
### 预览图

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widget/little-things/preview.png) 

![preview](https://raw.githubusercontent.com/langzhou/siyuan-note/main/widget/little-things/preview2.png) 
