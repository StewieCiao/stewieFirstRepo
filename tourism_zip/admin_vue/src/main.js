import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
const app = createApp(App);
//elelemtPlus以及全部icon
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
app.use(ElementPlus);
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

//js工具库 _split等
import lodash from "lodash";
window._ = lodash;
//全局注册axios以及默认请求地址，修改成可用地址
import qs from "qs";
app.config.globalProperties.$qs = qs;
import axios from "axios";
app.config.globalProperties.$axios = axios;
axios.defaults.baseURL = "http://localhost:3333/";
axios.interceptors.request.use(
  (config) => {
    if (sessionStorage.getItem("tourism_account")) {
      config.headers["Authorization"] = JSON.parse(
        sessionStorage.getItem("tourism_account")
      ).token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // alert(error);
    this.errorMsgBox(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          this.$store.commit("del_token");
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRoute.fullPath,
            },
          });
          break;
        case 500:
          Message;
      }
      return Promise.reject(error.response.data);
    } else {
      return window.const.net_connected_error;
    }
  }
);

//组件复用
app.mixin({
  methods: {
    errorMsgBox(notice) {
      this.$message({
        message: notice,
        type: "error",
      });
    },
    successMsgBox(notice) {
      if (!notice) {
        notice = "成功";
      }
      this.$message({
        message: notice,
        type: "success",
      });
    },
    //公共axios
    apiAll(data, api, config = {}) {
      //1、默认api
      if (!api) {
        api = window.http;
      }
      //2、上传地址时使用心得content-type
      if (api == window.fileUpload) {
        //文件上传头Content-Type
        axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
      } else {
        //默认头Content-Type
        axios.defaults.headers.post["Content-Type"] =
          "application/x-www-form-urlencoded";
      }
      //3、默认空参数
      if (!data) {
        const params = {};
        data.params = JSON.stringify(params);
      }
      let qsParam = qs.stringify(data);
      return async () => {
        const { method = "POST", error, defaultValue = null } = config;
        let res = null;
        try {
          if (method.toUpperCase() === "GET") {
            res = await axios.get(api, {
              params: qsParam,
            });
          } else {
            res = await axios.post(api, qsParam);
          }
          res = res.data;
          return res;
        } catch (e) {
          // this.$message({
          //   message: e.message,
          //   type: "error",
          // });
          if (_.isFunction(error)) {
            await error(e);
          }
          return defaultValue;
        }
      };
    },
    async withLoading(asyncFunc) {
      let res = null;
      try {
        res = await asyncFunc();
      } catch (e) {
        console.error("WithLoading Error: ", e);
      }
      return res;
    },
  },
});
app.use(router).mount("#app");
