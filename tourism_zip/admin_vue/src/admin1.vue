<template>
  <div id="diary-admin">
    <a-layout style="height: 100%">
      <a-layout-sider :collapsed="isCollapse"
        ><div
          style="
            height: 100px;
            padding: 6px;
            font-size: 15px;
            text-align: center;
            line-height: 100px;
            color: #fff;
          "
        >
          工作台
        </div>

        <a-menu
          theme="dark"
          mode="inline"
          :items="menuItems"
          @click="handleClick"
        ></a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header :style="headerStyle">
          <a-row v-if="!isExpansion" style="align-items: center">
            <a-col :span="1">
              <MenuFoldOutlined
                v-if="isCollapse"
                @click="isCollapse = !isCollapse"
                style="vertical-align: middle; cursor: pointer; color: #fff"
              />
              <MenuUnfoldOutlined
                v-else
                style="vertical-align: middle; cursor: pointer; color: #fff"
                @click="isCollapse = !isCollapse"
              />
            </a-col>

            <a-col
              :span="agent == 'Windows' ? 16 : 4"
              style="text-align: left; font-size: 18px"
            >
              <b></b>
            </a-col>

            <a-col
              :span="agent == 'Windows' ? 6 : 19"
              style="text-align: right"
            >
              <el-dropdown>
                <span
                  class="el-dropdown-link"
                  style="color: #666; line-height: 35px"
                >
                  <span style="margin-left: 5px" :style="{ color: '#fff' }">
                    <el-icon><user-filled /></el-icon>
                  </span>

                  <el-icon style="vertical-align: middle"
                    ><arrow-down
                  /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="logout"
                      divided
                      icon="switch-button"
                      >退出</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </a-col>
          </a-row>
        </a-layout-header>
        <a-layout-content :style="contentStyle">
          <a-row>
            <a-col :span="21">
              <a-tabs
                type="card"
                @tabClick="tabClick"
                v-model:activeKey="editableTabsValue"
              >
                <a-tab-pane
                  :tab="item.title"
                  :key="item.name"
                  v-for="item in editableTabs"
                >
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
          <div
            ref="child"
            :element-loading-text="loadText"
            element-loading-spinner="el-icon-loading"
          >
            <transition mode="out-in">
              <router-view
                :key="$route.fullPath"
                v-if="ifRouterAlive"
              ></router-view>
            </transition>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { h } from "vue";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  DesktopOutlined,
  PieChartOutlined,
  InboxOutlined,
} from "@ant-design/icons-vue";
let menuItems = [
  {
    icon: () => h(MailOutlined),
    key: "diary",
    label: "游记管理",
    title: "游记管理",
    name: "游记管理",
  },
  {
    icon: () => h(AppstoreOutlined),
    key: "report",
    label: "举报管理",
    title: "举报管理",
    name: "举报管理",
  },
  {
    icon: () => h(SettingOutlined),
    key: "comment",
    label: "评论管理",
    title: "评论管理",
    name: "评论管理",
  },
];
</script>
<script>
export default {
  data() {
    return {
      transitionName: "fade",
      ifRouterAlive: true,
      editableTabs: [],
      editableTabsValue: [],
      transitionName: "",
      isExpansion: false,
      isCollapse: false,
    };
  },
  created() {
    this.getInit();
  },
  provide() {
    //刷新
    return {
      reload: this.reload,
    };
  },
  methods: {
    getInit() {
      let tab = {};
      tab.name = "diary";
      tab.title = "游记管理";
      this.editableTabs.push(tab);
      this.editableTabsValue = "diary";
    },

    reload() {
      this.ifRouterAlive = false;
      this.$nextTick(() => {
        this.ifRouterAlive = true;
      });
    },

    //登出，调用登出
    async logout() {
      this.$router.push("/");
    },

    handleClick(val) {
      this.gotoPage(val.key, val.item.title);
    },

    tabClick(tab, event) {
      this.gotoPage(tab, tab);
    },
    gotoPage(componentName, menuName) {
      let exist = false;
      this.editableTabs.some((element) => {
        if (element.name == componentName) {
          exist = true;
          return false;
        }
      });
      if (!exist) {
        let tab = {};
        tab.title = menuName;
        tab.name = componentName;
        this.editableTabs.push(tab);
        window.sessionStorage.setItem(
          "my_tabs",
          JSON.stringify(this.editableTabs)
        );
      }
      this.editableTabsValue = componentName;
      window.sessionStorage.setItem("currentTab", this.editableTabsValue);
      this.$router.push(componentName);
    },
    //移除
    removeTab(targetName) {
      if (targetName == "index") {
        return false;
      }
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      window.sessionStorage.setItem("tabs", JSON.stringify(this.editableTabs));
      if (targetName != this.editableTabsValue) {
        this.gotoPage(this.editableTabs[this.editableTabs.length - 1].name);
      }
    },
  },
};
</script>
<style scoped lang="less">
#diary-admin {
  height: 100vh;
  /deep/.el-badge__content {
    top: 10px !important;
  }
  .el-main {
    padding: 0;
  }
  .logo {
    justify-content: center;
    display: flex;
    height: 6rem;
    text-align: center;
    img {
      height: 50px;
      margin-top: 12px;
    }
  }
  @media screen and (max-device-width: 1280px) {
    .conHeight {
      height: auto;
    }
  }
  @media screen and (max-device-width: 1440px) {
    .conHeight {
      height: auto;
    }
  }
  @media screen and (max-device-width: 1920px) {
    .conHeight {
      height: calc(100vh);
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .footer {
    background-color: #fafafa;
    text-align: center;
    font-size: 0.8rem;
    line-height: 27px;
    border-top: solid 1px #dcdfe6;
    color: #999;
    height: 28px;
  }
  .perImg {
    width: 2rem;
    height: 2rem;
    float: left;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .el-header {
    padding-left: 0 !important;
  }

  .el-icon-loading {
    font-size: 24px;
  }

  .el-aside {
    overflow-y: auto !important;
  }

  .left-menu {
    height: calc(100vh);
    overflow: hidden;

    .el-menu--collapse {
      max-width: 60px;
      overflow: hidden;
    }
    .el-submenu__title i {
      font-size: 14px;
    }
  }

  /deep/ .el-tabs__header {
    margin: 0 !important;
    border: none;
  }
  // //第一个标签不能关闭
  /deep/
    .el-tabs--card
    > .el-tabs__header
    .el-tabs__item:first-child
    .el-icon-close {
    display: none;
  }

  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 500ms;
    position: absolute;
  }

  .el-dropdown-link:focus {
    outline: none;
  }
  .el-dropdown {
    vertical-align: 0;
  }
  .el-dropdown-link {
    color: var(--el-color-primary);
  }

  //菜单修改
  .el-submenu:hover {
    outline: 0 !important;
    color: #fff !important;
    background: #409eff !important;
    border-radius: 3px;
  }
  .el-menu-item:hover {
    outline: 0 !important;
    color: #fff !important;
    background: #409eff !important;
    border-radius: 3px;
  }
  .el-menu {
    border-right: none;
  }
  .el-menu-item.is-active {
    background: #409eff !important;
    span {
      color: #ffffff !important;
    }
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
    outline: 0 !important;
  }
  .el-submenu__title:focus,
  .el-submenu__title:hover {
    span {
      color: #ffffff !important;
    }
    outline: 0 !important;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
    background-color: transparent;
  }
  .el-menu--horizontal .el-menu .el-menu-item,
  .el-menu--horizontal .el-menu .el-submenu__title {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
  }
  .el-menu--horizontal .el-menu .el-menu-item,
  .el-menu--horizontal .el-menu .el-submenu__title :hover {
    outline: 0 !important;
  }
  /deep/ .ant-row {
    border: none !important;
  }
  .fade {
    transition: transform 0.3s, opacity 0.3s;
    opacity: 1;
    transform: translateX(0);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: transform 0.3s, opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(6px);
  }
}
</style>
