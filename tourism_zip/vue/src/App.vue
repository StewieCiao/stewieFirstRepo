<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view
  ></el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ref, onMounted } from "vue";
let client = ref("");
onMounted(() => {});
</script>

<style lang="less">
:root {
  --primary-color: #1dce6d;
  --el-color-primary: #1dce6d !important;
  --el-color-primary-light-3: #25b365 !important;
}
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

  .search-item {
    margin-right: 30px;
    font-size: 13px;
    cursor: pointer;
  }
  .search-item::before {
    background-image: url(./assets/check.png);
    background-size: contain;
    background-position: 0 0;
    background-repeat: no-repeat;
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: -2px;
    margin-right: 6px;
    content: " ";
  }
  .search-item.checked {
    color: var(--primary-color);
  }
  .search-item.checked:before {
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: -2px;
    margin-right: 6px;
    content: " ";
    background-position: 0 0;
    background-repeat: no-repeat;
    background-image: url(./assets/checked.png);
  }

  .search-item:hover {
    color: var(--primary-color);
  }
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

.el-form-item__content {
  //justify-content: center;
}
.el-cascader {
  width: 100%;
}

.tags {
  display: inline-block;
  font-family: HiraginoSansGB-W3;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  text-align: center;
  color: #849aae;
  background-color: rgba(132, 154, 174, 0.1);
  border-radius: 3px;
  margin-right: 6px;
  padding: 0 11px;
  cursor: pointer;
}
.tags:hover {
  color: var(--el-color-primary-light-3);
}
.tags.green {
  background-color: var(--primary-color);
  color: #fff;
}
.tags.green:hover {
  background-color: var(--el-color-primary-light-3);
}
.tags .plain {
  background-color: transparent !important;
}

.el-upload-dragger {
  height: 100%;
}
</style>
