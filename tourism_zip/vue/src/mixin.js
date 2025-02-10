// mixins.js

import { reactive, computed } from "vue";
import axios from "axios";
import qs from "qs";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { showNotify } from "vant";

export const myMixin = () => {
  let allTags = reactive({
    obj: [
      { id: 1, name: "从你的全世界路过" },
      { id: 2, name: "放松、减压之旅" },
      { id: 3, name: "轻装上阵" },
      { id: 4, name: "说走就走" },
      { id: 5, name: "徒步去西藏" },
      { id: 6, name: "远离城市喧嚣" },
      { id: 7, name: "静听风的呼吸" },
      { id: 8, name: "海螺天空" },
      { id: 9, name: "梦里的那片青海湖" },
      { id: 10, name: "茶马古道" },

      { id: 11, name: "如沐春风" },
      { id: 12, name: "走南闯北" },
      { id: 13, name: "徒步爱好者" },
      { id: 14, name: "西藏、青海自由行" },
      { id: 15, name: "拉萨自由行" },

      { id: 16, name: "漠河极光" },
      { id: 17, name: "木姐小镇" },
      { id: 18, name: "延边小吃打卡" },
      { id: 19, name: "成都小吃一日游" },
      { id: 20, name: "三峡竹筏一日游" },
    ],
  });

  const agents = window.localStorage.getItem("ch_platform");
  const getDialogWdith = agents == "Windows" ? "35%" : "90%";
  const getDialogLabelPosition = agents == "Windows" ? "left" : "top";
  let agent = reactive({ obj: agents });
  let page = reactive({ obj: { startPage: 1, pageSize: 15, totalResult: 0 } });
  const tableMaxHeight = window.innerHeight - 250 + "px";

  const clearSearch = (reqData, mc) => {
    reqData.obj.data.name = "";
    mc(reqData);
  };

  const errorMsgBox = function (notice) {
    if (agents == "Windows") {
      ElNotification.error({
        title: "错误",
        message: notice,
        position: "bottom-right",
      });
    } else {
      showNotify({ type: "primary", message: notice });
    }
  };
  const successMsgBox = function (notice) {
    if (!notice) {
      notice = "成功";
    }
    if (agents == "Windows") {
      ElNotification({
        title: "提示",
        message: notice,
        position: "bottom-right",
      });
    } else {
      showNotify({ type: "warning", message: notice });
    }
  };
  const confirm = (notice, callback) => {
    // 显示消息提示框，并等待用户确认
    ElMessageBox.confirm(notice, "操作确认")
      .then(() => {
        callback();
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "Delete canceled",
        });
      });
  };
  //form表单提交，参数不用转换，自动修改头
  const formDataApi = (data, api) => {
    return async () => {
      let res = null;
      try {
        axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
        res = await axios.post(api, data);
        res = res.data;
        return res;
      } catch (e) {
        // this.$message({
        //   message: e.message,
        //   type: "error",
        // });
        errorMsgBox(e.message);
        if (_.isFunction(error)) {
          await error(e);
        }
        return defaultValue;
      }
    };
  };
  async function uploadImgs(imgList) {
    let formData = new FormData();
    for (const element of imgList) {
      formData.append("files", element.raw);
    }
    return await withLoading(formDataApi(formData, "/tourism/uploadFile"));
  }
  function sizeChange(val, met, reqData) {
    page.obj.startPage = 1;
    page.obj.pageSize = val;
    reqData.data.page = page.obj;
    // getData(reqData);
    met();
  }
  function currentChange(val, met, reqData) {
    page.obj.startPage = val;
    reqData.data.page = page.obj;
    // getData(reqData);
    met();
  }
  const getData = async (reqData) => {
    if (!reqData.data.page) {
      reqData.data.page = page.obj;
    }
    return await withLoading(apiAll(reqData.data, reqData.url));
  };
  const deleteById = async (id, url) => {
    return await withLoading(apiAll({ _id: id }, url));
  };
  const apiAll = (data, api, config = {}) => {
    axios.defaults.headers.post["Content-Type"] = "application/json";

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
        errorMsgBox(e.message);
        if (_.isFunction(error)) {
          await error(e);
        }
        return defaultValue;
      }
    };
  };
  const withLoading = async (asyncFunc) => {
    let res = null;
    try {
      res = await asyncFunc();
    } catch (e) {
      console.error("WithLoading Error: ", e);
    }
    return res;
  };

  const showSimpleDate = (timestamp) => {
    //将日期化为时间戳进行比较
    var date = new Date(timestamp);
    timestamp = date.getTime();

    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - timestamp;
    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
      return "不久前";
    }
    // 计算差异时间的量级
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    // 数值补0方法
    let zero = function (value) {
      if (value < 10) {
        return "0" + value;
      }
      return value;
    };
    // 使用
    if (monthC > 4) {
      // 超过1年，直接显示年月日
      return (function () {
        let date = new Date(timestamp);
        return (
          date.getFullYear() +
          "年" +
          zero(date.getMonth() + 1) +
          "月" +
          zero(date.getDate()) +
          "日"
        );
      })();
    } else if (monthC >= 1) {
      return parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
      return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
      return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
      return parseInt(minC) + "分钟前";
    }
    return "刚刚";
  };

  return {
    errorMsgBox,
    successMsgBox,
    confirm,
    formDataApi,
    apiAll,
    withLoading,
    showSimpleDate,
    page,
    allTags,
    getDialogWdith,
    getDialogLabelPosition,
    sizeChange,
    currentChange,
    getData,
    clearSearch,
    agent,
    uploadImgs,
    tableMaxHeight,
    deleteById,
  };
};
