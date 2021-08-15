# 思源笔记工具箱 Siyuan Utils 

## 前言
介绍项目之前先写点别的。

思源笔记是目前我接触到的最能满足我需要的一款笔记软件，本地存储、可玩性强、迭代快、开发者友好是我中意它的几点缘由。

然而受到开发资源的限制，我个人对于软件的一些迫切需求未能及时实现，所以想着自己是否可以先做点什么。于是6月份（2021）开始正式接触学习JavaScript，在此之前我仅有一些 PHP 和 Python 的经验，而且也都是自学。所以，这个项目也算是我个人作为一个前端新手边学边用的学习记录，在满足自身需求的同时，也在探索思源笔记的可能性。

由于目前官方暂未提供插件接口，本项目实现的方式有些 hack，因此暂不提供 js 注入方法，有需要的请自行探索。

哦，对了，我的订阅推荐码 `4EY48YJ`

## 项目简介
Siyuan Utils 项目包括 Chrome Extension 和 Local Script 两部分。

其中 Chrome Extension（[详见](https://github.com/langzhou/siyuan-note/tree/main/chrome-extension)）主要满足一些网络资料收集的场景，比如微信读书笔记导入等，而 Local Script 则是对客户端本体进行功能增强。

Local Script 已实现的功能（部分源码未更新）：
- 题头图位置调整
- 浮动工具条
- @呼出块属性菜单
- 快捷搜索框（暂时可支持豆瓣书籍信息搜索和导入）
- 内容块批注评论

项目结构
- index.js 入口文件
- /libs 类库
- /utils 工具包
- /css 样式表
- /assets 静态资源文件

项目命令
- 安装 `npm install`
- 运行 `npm run dev`
- 构建 `npm run build`
## 功能预览

### Comment

![img](https://raw.githubusercontent.com/langzhou/siyuan-note/main/siyuan-utils/preview/comment-1.png)
### Search Box

![img](https://raw.githubusercontent.com/langzhou/siyuan-note/main/siyuan-utils/preview/searchbox-1.png)

### Image Share
![img](https://raw.githubusercontent.com/langzhou/siyuan-note/main/siyuan-utils/preview/image-share-1.png)
