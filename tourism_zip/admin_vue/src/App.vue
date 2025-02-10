<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view
  ></el-config-provider>
</template>

<style lang="less">
body {
  padding: 0;
  margin: 0 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
::-webkit-scrollbar-thumb {
  background-color: #018ee8;
  height: 1px;
  outline-offset: -2px;
  // outline: 2px solid red;
  -webkit-border-radius: 4px;
  border: none;
}
/*---鼠标点击滚动条显示样式--*/
::-webkit-scrollbar-thumb:hover {
  background-color: #fb4446;
  height: 2px;
  -webkit-border-radius: 4px;
}
// 外层轨道
::-webkit-scrollbar-track {
  background-color: #fff;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
}
//实际有效控制滚动条粗细
body *::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
/*---滚动条大小--*/
::-webkit-scrollbar {
  width: 1px;
}
/*---滚动框背景样式--*/
::-webkit-scrollbar-track-piece {
  background-color: #fff;
  -webkit-border-radius: 0;
}
</style>
