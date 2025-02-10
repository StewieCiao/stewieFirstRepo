const { defineConfig } = require("@vue/cli-service");
//vant css插件begin
const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin"); // add

//vant css插件end
module.exports = defineConfig({
  publicPath: "./",
  outputDir: "dist",
  indexPath: "index.html",
  assetsDir: "static",
  lintOnSave: false,
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver(), new NodePolyfillPlugin()],
      }),
    ],
  },

  devServer: {
    host: "localhost", // 本地主机
    port: 8080, // 端口号的配置
    open: true, // 自动打开浏览器
    proxy: {
      "/api": {
        target: "http://182.92.83.79:9098/", // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        pathRewrite: {
          "^/api": "/", // 重写路径
        },
      },
    },
  },
});
