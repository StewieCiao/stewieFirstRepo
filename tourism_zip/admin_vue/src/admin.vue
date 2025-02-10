<template>
  <div id="diary-admin">
    <el-container class="conHeight">
      <el-aside
        :style="{
          color: systemInfo.fontColor,
          background: systemInfo.bgColor,
          transform: 'all 0.3s',
        }"
        :width="isCollapse ? '50px' : '200px'"
      >
        <el-menu
          :default-active="editableTabsValue"
          :text-color="systemInfo.fontColor"
          :background-color="systemInfo.bgColor"
          :collapse="isCollapse"
          :unique-opened="true"
        >
          <div
            class="logo"
            :style="{
              color: systemInfo.fontColor,
              background: systemInfo.bgColor,
            }"
          >
            <img :src="account.obj.companyLogo" alt="" v-if="!isCollapse" />
          </div>

          <el-menu-item
            key="diary"
            index="diary"
            @click="gotoPage('diary', '游记管理')"
          >
            <el-icon
              :size="systemInfo.fontSize"
              :style="{ color: systemInfo.fontColor }"
              ><edit-pen
            /></el-icon>
            <span
              :style="{
                color: systemInfo.fontColor,
                fontSize: systemInfo.fontSize,
              }"
            >
              游记管理
            </span>
          </el-menu-item>

          <el-menu-item
            key="report"
            index="report"
            @click="gotoPage('report', '举报管理')"
          >
            <el-icon
              :size="systemInfo.fontSize"
              :style="{ color: systemInfo.fontColor }"
              ><View
            /></el-icon>
            <span
              :style="{
                color: systemInfo.fontColor,
                fontSize: systemInfo.fontSize,
              }"
            >
              举报管理
            </span>
          </el-menu-item>

          <el-menu-item
            key="comment"
            index="comment"
            @click="gotoPage('comment', '评论管理')"
          >
            <el-icon
              :size="systemInfo.fontSize"
              :style="{ color: systemInfo.fontColor }"
              ><View
            /></el-icon>
            <span
              :style="{
                color: systemInfo.fontColor,
                fontSize: systemInfo.fontSize,
              }"
            >
              评论管理
            </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header
          :style="{
            padding: '0 !important',
            height: isExpansion ? '40px !important' : '90px !important',
          }"
        >
          <el-row
            :style="{
              borderBottom: '1px solid #e4e7ed',
              lineHeight: '45px',
              height: '45px',
              padding: '5px',
              marginBottom: '5px',
            }"
          >
            <el-col :span="2" style="display: flex">
              <div style="margin-right: 50px">
                <el-icon
                  v-if="isCollapse"
                  @click="isCollapse = !isCollapse"
                  style="vertical-align: middle; cursor: pointer"
                  ><expand
                /></el-icon>
                <el-icon
                  v-else
                  style="vertical-align: middle; cursor: pointer"
                  @click="isCollapse = !isCollapse"
                  ><fold
                /></el-icon>
              </div>

              <el-badge :offset="[10, 5]" class="item">
                <el-icon
                  style="
                    vertical-align: middle;
                    font-size: 16px;
                    cursor: pointer;
                  "
                  ><BellFilled
                /></el-icon>
              </el-badge>
            </el-col>

            <el-col :span="16" style="text-align: left; font-size: 18px">
              <b>{{ account.obj.companyName }}</b>
            </el-col>

            <el-col :span="6" style="text-align: right">
              <el-dropdown @command="handleCommand">
                <span
                  class="el-dropdown-link"
                  style="color: #666; line-height: 35px"
                >
                  <span style="margin-left: 5px">
                    {{ account.obj.account_name }}
                    <el-icon style="color: #e6a23c"><user-filled /></el-icon>
                  </span>

                  <el-icon style="vertical-align: middle"
                    ><arrow-down
                  /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>个人设置</el-dropdown-item>
                    <el-dropdown-item class="setPer" command="mySet" icon="user"
                      >我的设置</el-dropdown-item
                    >
                    <el-dropdown-item
                      command="logout"
                      divided
                      icon="switch-button"
                      >登出</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>

          <el-row style="border-bottom: 1px solid #e4e7ed; margin-left: 10px">
            <el-col :span="21">
              <el-tabs
                v-model="editableTabsValue"
                closable
                type="card"
                @tab-remove="removeTab"
                @tab-click="tabClick"
              >
                <el-tab-pane
                  :label="item.title"
                  :name="item.name"
                  v-for="item in editableTabs"
                  :key="item"
                >
                  <template #label>
                    <span>
                      {{ item.title }}
                    </span>
                  </template>
                </el-tab-pane>
              </el-tabs>
            </el-col>
            <el-col :span="3" style="cursor: pointer; text-align: right">
              <el-button type="text" icon="refresh" @click="reload"></el-button>

              <el-dropdown @command="handleTabsCommand">
                <span class="el-dropdown-link">
                  <el-icon
                    class="el-icon--right"
                    style="vertical-align: middle"
                  >
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="a"
                      >关闭其他菜单</el-dropdown-item
                    >
                    <el-dropdown-item command="b"
                      >关闭当前菜单</el-dropdown-item
                    >
                    <el-dropdown-item command="c"
                      >关闭全部菜单</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main
          ref="child"
          :element-loading-text="loadText"
          element-loading-spinner="el-icon-loading"
        >
          <transition :name="transitionName">
            <router-view
              :key="$route.fullPath"
              v-if="ifRouterAlive"
            ></router-view>
          </transition>
        </el-main>
        <el-footer class="footer">
          {{ account.obj.logoPath }}
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();
let account = reactive({
  obj: {},
});
onMounted(() => {
  if (window.sessionStorage.getItem("tourism_account")) {
    account.obj = JSON.parse(window.sessionStorage.getItem("tourism_account"));
  } else {
    router.push("/");
  }
});
</script>
<script>
export default {
  data() {
    return {
      transitionName: "fade",

      systemInfo: {
        fontColor: "#F5F3F3",
        fontSize: "15px",
        bgColor: "#150C0D",
      },
      ifRouterAlive: true,
      girl: "",
      boy: "",
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
      if (sessionStorage.my_tabs) {
        this.editableTabs = JSON.parse(sessionStorage.my_tabs);
        if (isNaN(sessionStorage.currentTab)) {
          this.editableTabsValue = sessionStorage.currentTab;
        } else {
          this.editableTabsValue = parseInt(sessionStorage.currentTab);
        }
      }
    },

    reload() {
      this.ifRouterAlive = false;
      this.$nextTick(() => {
        this.ifRouterAlive = true;
      });
    },
    handleCommand(command) {
      this[command]();
    },
    handleTabsCommand(command) {
      if ("a" == command) {
        //关闭其他菜单
        this.editableTabs.forEach((element) => {
          if (element.name != this.editableTabsValue) {
            this.removeTab(element.name);
          }
        });
      } else if ("b" == command) {
        //关闭当前菜单
        this.editableTabs.some((element) => {
          if (element.name == this.editableTabsValue) {
            this.removeTab(element.name);
            return false;
          }
        });
      } else if ("c" == command) {
        //关闭全部菜单
        this.editableTabs.forEach((element) => {
          this.removeTab(element.name);
        });
      }
    },
    //登出，调用登出
    async logout() {
      this.$router.push("/");
      window.sessionStorage.removeItem("tourism_account");
      window.sessionStorage.removeItem("my_tabs");
      window.sessionStorage.removeItem("currentTab");
    },

    tabClick(tab, event) {
      this.gotoPage(tab.props.name, tab.props.label);
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
