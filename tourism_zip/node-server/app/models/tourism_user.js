const mongoose = require("mongoose");
const moment = require("moment");
const { Schema, model } = mongoose;
/** 用户表*/
const tourism_userSchema = new Schema(
  {
    user_name: String, //用户名
    password: String, //密码
    user_img: String,
    tags: Array, //个人标签 用来个性推送游记
    create_dtme: String, //注册时间
  },
  { versionKey: false }
);
tourism_userSchema.pre("save", function (next) {
  this.create_dtme = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});
module.exports = model("tourism_user", tourism_userSchema, "tourism_user");
