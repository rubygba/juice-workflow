#Front End Workflow.

#目录

```bash
| - juice-workflow
    | - .temp 本地服务器目录
    | - dist 发布目录
    | - node_modules nodejs模块
    | - src  开发源码
        | - bower_components 前端依赖的脚本
        | - fonts 字体文件
        | - html_modules html模块
        | - images 图片模块
        | - script js文件
        | - node_modules nodejs模块
        | - sass scss文件
        | - templates 模板文件
    | - app.js 服务器端测试主程序模块
    | - config.js 转发规则配置
    | - README.md 项目说明文件

```
#安装

* 安装node、gulp
* 根目录
* 运行 `npm install` 安装node模块
* 运行 `bower install` 初始化前端依赖库

#运行

* 运行 `gulp` 命令，自动构建到 `.temp` 本地服务器测试
* 运行 `gulp dist` 发布整合压缩后的代码，打包发布或通过本地ip访
