const mongoose = require("mongoose");
const moment = require("moment");
const { Schema, model } = mongoose;
/** 评论举报  */
const tourism_user_reportSchema = new Schema(
  {
    user_id: String, //用户名
    comment_id: String, //密码
    report_content: String,
    create_dtme: String, //注册时间
  },
  { versionKey: false }
);
tourism_user_reportSchema.pre("save", function (next) {
  this.create_dtme = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});
module.exports = model(
  "tourism_user_report",
  tourism_user_reportSchema,
  "tourism_user_report"
);
