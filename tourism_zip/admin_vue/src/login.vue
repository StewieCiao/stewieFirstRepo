<template>
  <div class="login-body">
    <div class="login-panel" :style="{ maxWidth: ' 360px' }">
      <div class="login-title">游记管理登录</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="username">
          <el-input
            placeholder="请输入账号"
            v-model="formData.user_name"
            size="large"
            type="text"
          >
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="formData.password"
            size="large"
            type="password"
            @keyup.enter.native="login()"
          >
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            style="width: 100%"
            @click="login()"
            size="large"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { myMixin } from "./mixin.js";
const { errorMsgBox, successMsgBox, apiAll, withLoading } = myMixin();
const formDataRef = ref();
let formData = reactive({
  user_name: "",
  password: "",
});
const rules = {
  user_name: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
};

const login = async () => {
  let data = formData;
  const res = await withLoading(apiAll(data, "/tourism/loginRegister"));
  if (res.code && res.code < 0) {
    errorMsgBox(res.msg);
  } else {
    window.sessionStorage.setItem("tourism_account", JSON.stringify(res));
    router.push("/diary");
  }
};
</script>

<style lang="less" scoped>
.login-body {
  background: url("./assets/bg.webp") no-repeat center center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: absolute;
  left: 0;
  top: 0;

  .login-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    padding: 25px;
    width: 26%;
    height: 30%;
    min-height: 300px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5%;
    box-shadow: 2px 2px 10px #ddd;

    .login-title {
      margin-top: 20px;
      font-size: 22px;
      text-align: center;
      margin-bottom: 22px;
    }
  }
}
</style>
