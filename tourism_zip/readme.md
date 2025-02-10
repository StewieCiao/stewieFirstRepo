## 项目目标：

现代人压力大节奏快，因此出游成为了最佳的放松减压方式。在旅行中，难免会拍摄一些照片、获得一些心得。本项目就是这样的一个平台，能够将大家的照片、游记分享出来。可以分享自己 旅行记忆的同时，也能够查看他人的游记。

##  项目功能

注册登录、游记分享、图文列表预览、图文上传、点赞、评论、收藏等

## 页面

个人中心
首页
登录注册

##  主要技术

前端：vue3+axios+html/css+element plus+quill

数据库：mongodb

后端服务：nodejs(express.js)

## 代码简介

###  node-server:nodejs +express.js 部署的后端服务
1.server.js: 入口文件 连接数据库并监听端口启动服务
2.models : mongoose 映射表单文件夹 , 可以操作数据库
3.servie : 服务文件，所有的接口都放在这里，包括文件接口/其他服务接口等
4.routes： 路由映射文件
5.uploads: 静态文件存储文件夹

### vue:vue3+elementplus 部署的前端服务
index.vue:首页
myHeader: 公告header 组件
person:个人设置
personCenter:个人中心
myLoginDIalog:自定义登录注册弹框
quillEditor:quill 富文本插件
router：路由配置
main.js：使用axios 进行http调用，并进行接口拦截 

