// mixins.js

import { reactive, computed, nextTick } from "vue";
import axios from "axios";
import qs from "qs";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";

export const myMixin = () => {
  const tableMaxHeight = window.innerHeight - 250 + "px";
  const page = reactive({
    obj: { startPage: 1, pageSize: 15 },
  });
  const account = window.sessionStorage.getItem("tourism_account")
    ? JSON.parse(window.sessionStorage.getItem("tourism_account")).account
    : {};
  const clearSearch = (reqData, mc) => {
    reqData.obj.data.name = "";
    mc(reqData);
  };
  const errorMsgBox = function (notice) {
    ElNotification.error({
      title: "错误",
      message: notice,
      position: "bottom-right",
    });
  };
  const successMsgBox = function (notice) {
    if (!notice) {
      notice = "成功";
    }

    ElNotification({
      title: "提示",
      message: notice,
      position: "bottom-right",
    });
  };
  const confirm = (notice, callback, val) => {
    // 显示消息提示框，并等待用户确认
    ElMessageBox.confirm(notice, "操作确认")
      .then(() => {
        callback(val);
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除",
        });
      });
  };
  //form表单提交，参数不用转换，自动修改头
  const formDataApi = (data, api) => {
    return async () => {
      let res = null;
      try {
        res = await axios.post(api, data);
        res = res.data;
        return res;
      } catch (e) {
        errorMsgBox(e.message);
        if (_.isFunction(error)) {
          await error(e);
        }
        return defaultValue;
      }
    };
  };

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
    //1、默认api
    if (!api) {
      api = window.http;
    }
    return async () => {
      const { method = "POST", error, defaultValue = null } = config;
      let res = null;
      try {
        if (method.toUpperCase() === "GET") {
          res = await axios.get(api, {
            data: data,
          });
        } else {
          res = await axios.post(api, data);
        }
        res = res.data;
        return res;
      } catch (e) {
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

  return {
    errorMsgBox,
    successMsgBox,
    confirm,
    formDataApi,
    apiAll,
    withLoading,
    sizeChange,
    currentChange,
    getData,
    clearSearch,
    deleteById,
    page,
  };
};
