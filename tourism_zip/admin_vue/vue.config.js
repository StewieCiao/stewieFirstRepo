const { defineConfig } = require("@vue/cli-service");

//vant css插件end
module.exports = defineConfig({
  publicPath: "./",
  outputDir: "dist",
  indexPath: "index.html",
  assetsDir: "static",
  lintOnSave: false,
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: "localhost", // 本地主机
    port: 8080, // 端口号的配置
    open: true, // 自动打开浏览器
    proxy: {
      "/api": {
        target: "http://localhost:3333/", // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          "^/api": "/", // 重写路径
        },
      },
    },
  },
});
