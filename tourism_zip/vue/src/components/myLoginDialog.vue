<template>
  <div id="my-login" v-if="showDialog">
    <div class="Overlay">
      <div class="Modal" tabindex="-1" role="dialog" aria-modal="true">
        <div style="display: flex; justify-content: flex-end">
          <img
            src="https://daimane.com/free/static/img/1719026568059.png"
            style="cursor: pointer; width: 25px"
            @click="closeDialog"
          />
        </div>
        <div class="login-container">
          <div
            style="
              display: flex;
              cursor: pointer;
              margin-bottom: 10px;
              border-bottom: 1px solid #f8f7f5;
            "
          >
            <h3
              style="margin-right: 20px"
              :class="currentMenu == 1 ? 'current-menu' : 'not-current-menu'"
              @click="currentMenu = 1"
            >
              登录
            </h3>
            <h3
              :class="currentMenu == 2 ? 'current-menu' : 'not-current-menu'"
              @click="currentMenu = 2"
            >
              注册
            </h3>
          </div>
          <!-- <p>to your ISS account</p> -->
          <form>
            <input
              placeholder="用户名"
              style="margin-bottom: 40px"
              v-model="model.user_name"
            />

            <input
              type="password"
              placeholder="密码"
              style="margin-bottom: 40px"
              v-model="model.password"
            />
            <div class="login-options">
              <button type="button" style="font-size: 15px" @click="doSubmit">
                {{ model.currentMenu == 1 ? "注册" : "登录" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { showDialog: { type: Boolean, default: false } },
  data() {
    return {
      currentMenu: 1,
      model: { user_name: "", password: "" },
    };
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async regist() {},

    doSubmit() {
      this.$emit("doSubmit", this.model);
    },
  },
};
</script>

<style>
.Modal {
  position: fixed;
  top: 36%;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}

.Overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.Modal {
  width: 350px;
  max-width: 90%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}
.Modal .login-container {
  text-align: center;
  padding: 30px;
}
.Modal h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.Modal form {
  display: flex;
  flex-direction: column;
}

.Modal input {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #f5f5f5;
  color: var(--primary-color);

  border-radius: 5px;
  outline: 0;
}
.Modal input:focus {
  border: 1px solid var(--primary-color);
}
.Modal button {
  padding: 10px;
  background-color: var(--primary-color); /* 修改按钮颜色 */
  border: none;
  color: #fff;
  border-radius: 5px;
  font-size: 1em;
  width: 100%;
  cursor: pointer;
  outline: 0;
}
.Modal button:hover {
  background-color: var(--primary-color); /* 修改按钮颜色 */
}

.Modal .social-login {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.Modal .social-login button {
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9em;
  cursor: pointer;
}

.Modal .alternative-login {
  text-align: center;
  margin-top: 20px;
}

.Modal a {
  color: #007bff;
  text-decoration: none;
}

.Modal .not-current-menu {
  color: #f3f2e6;
}
.Modal .current-menu {
  color: var(--primary-color);
}
.Modal .current-menu:after {
  display: block;
  content: "";
  transform: translateY(17px);
  width: 30px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 2px;
}
</style>
