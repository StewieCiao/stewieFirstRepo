const mongoose = require("mongoose");
const moment = require("moment");
const { Schema, model } = mongoose;
/**
 * 游记收藏表
 */
const tourism_collectSchema = new Schema(
  {
    user_id: String,
    diary_id: String,
    create_dtme: String,
  },
  { versionKey: false }
);
tourism_collectSchema.pre("save", function (next) {
  this.create_dtme = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});
module.exports = model(
  "tourism_collect",
  tourism_collectSchema,
  "tourism_collect"
);
