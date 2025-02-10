const mongoose = require("mongoose");
const moment = require("moment");
const { Schema, model } = mongoose;
/** 用户自定义标签*/
const tourism_user_tagsSchema = new Schema(
  {
    user_id: String,
    name: String,
    create_dtme: String,
  },
  { versionKey: false }
);
tourism_user_tagsSchema.pre("save", function (next) {
  this.create_dtme = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});
module.exports = model(
  "tourism_user_tags",
  tourism_user_tagsSchema,
  "tourism_user_tags"
);
