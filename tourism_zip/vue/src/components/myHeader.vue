<template>
  <div>
    <div>
      <div class="header">
        <div class="my-btn-group" v-if="!project_user.obj">
          <div class="login" @click="showDialog = true">登录/注册</div>
        </div>

        <div class="my-btn-group" v-else>
          <div
            class="login"
            @click="gotoPersonIndex"
            style="margin-right: 10px"
          >
            {{ project_user.obj.user_name }}
          </div>

          <el-button text type="primary" icon="CircleClose" @click="logout"
            >退出</el-button
          >
        </div>

        <div class="my-btn-group">
          <div class="login" @click="gotoIndex">首页</div>
        </div>
      </div>
      <div style="width: 100%; background: #f5f5f6">
        <div class="header-title">
          <div style="width: 100%" v-if="project_user && project_user.obj">
            <div style="display: flex; align-items: center">
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-right: 20px;
                "
              >
                <img
                  @click="gotoPerson"
                  style="
                    cursor: pointer;
                    width: 70px;
                    height: 70px;
                    margin-bottom: 10px;
                    border-radius: 50%;
                  "
                  :src="
                    project_user.obj && project_user.obj.user_img
                      ? project_user.obj.user_img
                      : defaultImg
                  "
                />
                <span style="font-weight: bold">{{
                  project_user.obj && project_user.obj
                    ? project_user.obj.user_name
                    : ""
                }}</span>
              </div>
              <div style="font-size: 14px">
                <span
                  v-for="(j, index) in project_user.obj.tags.slice(0, 5)"
                  :key="index"
                  class="tags"
                  style="margin-bottom: 20px"
                  >{{ j.name }}</span
                >
                <span
                  @click="showMore = true"
                  class="tags"
                  v-if="project_user.obj.tags.length >= 5"
                  >查看更多<el-icon><ArrowRightBold /></el-icon
                ></span>
              </div>
            </div>
          </div>
          <div class="search__wrap" v-if="!isPerson">
            <input
              class="search__input"
              v-model="project_name"
              placeholder="搜索您关心的游记内容，如爬山、徒步进藏"
            />
            <span class="search__button" @click="searchData"></span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <el-dialog v-model="showMore" title="个人标签">
        <span
          v-for="(j, index) in project_user.obj.tags"
          :key="index"
          class="tags"
          style="margin-bottom: 20px"
          >{{ j.name }}</span
        >
      </el-dialog>
    </div>
    <myLoginDialog
      style="position: fixed; z-index: 99"
      :showDialog="showDialog"
      @closeDialog="showDialog = false"
      @doSubmit="doLogin"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { myMixin } from "../mixin.js";
const { errorMsgBox, successMsgBox, apiAll, withLoading } = myMixin();
import { useRouter, useRoute } from "vue-router";
let router = useRouter();
let route = useRoute();
const showDialog = ref(false);
const project_user = reactive({ obj: "" });
let isPerson = ref(false);
let showMore = ref(false);
let defaultImg = require("../assets/user.png");

const props = defineProps({});
const $emit = defineEmits(["doLogin", "searchData"]);
const project_name = ref("");
const defaultUserImg = require("../assets/user.png");
onMounted(() => {
  if (window.sessionStorage.getItem("tourism_user")) {
    project_user.obj = JSON.parse(
      window.sessionStorage.getItem("tourism_user")
    );
  }
  if (route.path == "/person") {
    isPerson.value = true;
  }
});
function searchData() {
  $emit("searchData", project_name.value);
}
function logout() {
  window.sessionStorage.removeItem("tourism_user");
  project_user.obj = "";
  router.push("/");
  successMsgBox("退出成功！");
}

async function doLogin(model) {
  const res = await withLoading(apiAll(model, "/tourism/loginRegister"));
  if (res.code >= 0) {
    window.sessionStorage.setItem("tourism_user", JSON.stringify(res));
    project_user.obj = res;
    showDialog.value = false;
    successMsgBox("登录成功！");
  } else {
    errorMsgBox(res.msg);
  }
}
// async function doLogin(model) {
//   const res = await withLoading(apiAll(model, "/rent/regist"));
//   if (res.code >= 0) {
//     window.sessionStorage.setItem("rent_house_user", JSON.stringify(res));
//     project_user.obj = res;
//     showDialog.value = false;
//     window.location.reload();
//     successMsgBox("log in success");
//   } else {
//     errorMsgBox(res.msg);
//   }
// }
function gotoIndex() {
  router.push("/");
  // if (route.fullPath == "/") {
  //   router.replace("/" + project_name.value);
  //   //window.location.reload();
  // } else {
  //   router.push("/" + project_name.value);
  // }
}

function gotoPersonIndex() {
  router.push("/personCenter");
}
function gotoPerson() {
  router.push("/person");
}
</script>

<style scoped lang="less">
.header {
  /deep/ .el-input__inner {
    border-radius: 50px !important;
  }
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(228, 230, 235, 0.5);
  .my-btn-group {
    display: flex;
    height: 30px;
    line-height: 30px;
    margin: 5px 0;
    .login {
      border-radius: 50px;
      cursor: pointer;
      font-size: 13px;
      height: 100%;
      padding: 0 20px;
      background: var(--primary-color);
      color: #f4f4f4;
      margin-right: 10px;
    }
    .regist {
      background: #f4f4f4;
      color: #000;
    }
  }
}
.header-title {
  height: 130px;
  width: 60%;
  margin: 0 auto;
  padding: 25px 0;
  display: flex;
  align-content: center;
  justify-content: center;
  box-sizing: border-box;

  .search__wrap {
    position: relative;
    display: inline-block;
    width: 710px;
    height: 44px;
    line-height: 40px;
    font-size: 14px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.2);
    .search__input {
      width: 668px;
      text-indent: 20px;
      //  padding: 16px 23px 17px;
      box-sizing: border-box;
      border-width: 0;
      font-size: 13px;
    }
    .search__button {
      position: absolute;
      width: 38px;
      height: 38px;
      top: 3px;
      right: 4px;
      color: transparent;
      text-align: center;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-image: url("../assets/search.jpg");
      background-size: contain;
    }
  }
}
</style>
