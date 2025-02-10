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

import myHeader from "./components/myHeader";
app.use(myHeader);
import myLoginDialog from "./components/myLoginDialog";
app.use(myLoginDialog);

import {
  Progress,
  Button,
  Col,
  Row,
  TimePicker,
  DatePicker,
  Dialog,
  Popup,
  Picker,
  RadioGroup,
  Radio,
  NavBar,
  Tabbar,
  TabbarItem,
  ActionSheet,
  Icon,
  NoticeBar,
  Loading,
  Empty,
  ImagePreview,
} from "vant";

// 2. 引入组件样式
import "vant/lib/index.css";
// import { Icon } from "@tsingsu/mui";

// 3. 注册你需要的组件
app.use(Button);
app.use(Col);
app.use(Row);
app.use(Dialog);
app.use(TimePicker);
app.use(DatePicker);
app.use(Progress);
app.use(Popup);
app.use(Picker);
app.use(RadioGroup);
app.use(Radio);
app.use(NavBar);
app.use(Tabbar);
app.use(TabbarItem);
app.use(ActionSheet);
app.use(Icon);
app.use(NoticeBar);
app.use(Loading);
app.use(Empty);
app.use(ImagePreview);

//js工具库 _split等
import lodash from "lodash";
window._ = lodash;
//全局注册axios以及默认请求地址，修改成可用地址
import qs from "qs";
app.config.globalProperties.$qs = qs;
import axios from "axios";
app.config.globalProperties.$axios = axios;
axios.defaults.baseURL = "http://localhost:3333";

axios.interceptors.request.use(
  (config) => {
    if (sessionStorage.getItem("tourism_user")) {
      config.headers["Authorization"] = JSON.parse(
        sessionStorage.getItem("tourism_user")
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
    if (error.response) {
      console.log(error);
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
      return async () => {
        const { method = "POST", error, defaultValue = null } = config;
        let res = null;
        try {
          if (method.toUpperCase() === "GET") {
            res = await axios.get(api, data);
          } else {
            res = await axios.post(api, data);
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
