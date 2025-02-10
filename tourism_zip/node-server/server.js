// 引入必要的模块
const express = require("express");
const morgan = require("morgan"); // 日志中间件
const bodyParser = require("body-parser"); // 请求体解析中间件
const cors = require("cors"); // 跨域资源共享中间件
const app = express(); // 创建Express应用实例
const tools = require("./tools");
const mongoose = require("mongoose"); // 跨域资源共享中间件
mongoose.connect("mongodb://localhost:27017/tourism_diary").then((r) => {
  console.log("数据库链接成功");
});

// 使用中间件
app.use(cors()); // 启用CORS支持
app.use(morgan("tiny")); // 使用tiny格式记录请求日志
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
); // 解析application/x-www-form-urlencoded
app.use(bodyParser.json()); // 解析application/json
// 对于其他所有请求的默认响应 【拦截器作用】 必须放在上面才生效
app.use(async (req, res, next) => {
  // res.sendStatus(404);
  console.log(req.url);
  if (req.headers["authorization"]) {
    let user = await tools.unsignToken(req.headers["authorization"]);
    req.headers["user"] = user;
  }
  const start = new Date();
  const ms = new Date() - start;
  console.log(`新请求：${req.method} ${req.url} - ${ms}ms`);
  await next();
});
// 设置服务器端口
const HTTP_PORT = 3333;

// 启动服务器
app.listen(HTTP_PORT, () => {
  console.log("服务器正在运行于端口: " + HTTP_PORT);
});

// 根路径响应
app.get("/", (req, res, next) => {
  res.json({
    status: "服务器正常",
  });
});

require("./app/routes/commonRoute.js")(app);
require("./app/routes/userRoute.js")(app);
