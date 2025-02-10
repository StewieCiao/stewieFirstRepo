const mongoose = require("mongoose");
const moment = require("moment");
const { Schema, model } = mongoose;
/**
 * 游记表
 */
const tourism_diarySchema = new Schema(
  {
    title: String, //游记标题
    user_id: String, //发布者
    share_content: String, //发布内容
    tags: Array, //标签，用来做推送，各类标签
    share_imgs: {
      //分享的图片

      type: Array,
      default: [],
    },
    publish_status: { default: 1, type: Number },
    status: { default: 1, type: Number },
    examine_status: { default: 0, type: Number }, //审核标记
    zan_count: { default: 0, type: Number },
    comment_count: { default: 0, type: Number },
    collect_count: { default: 0, type: Number },
    create_dtme: String, //发布时间
  },
  { versionKey: false }
);
tourism_diarySchema.pre("save", function (next) {
  this.create_dtme = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});
module.exports = model("tourism_diary", tourism_diarySchema, "tourism_diary");
