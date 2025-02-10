const mongoose = require("mongoose");
const moment = require("moment");
const { Schema, model } = mongoose;
/**
 * 游记评论表
 */
const tourism_commentSchema = new Schema(
  {
    user_id: String,
    diary_id: String,
    replay_user_id: String, //回复人ID
    comment: String,
    create_dtme: String,
  },
  { versionKey: false }
);
tourism_commentSchema.pre("save", function (next) {
  this.create_dtme = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});
module.exports = model(
  "tourism_comment",
  tourism_commentSchema,
  "tourism_comment"
);
