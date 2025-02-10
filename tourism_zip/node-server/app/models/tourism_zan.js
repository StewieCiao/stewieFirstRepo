const mongoose = require("mongoose");
const moment = require("moment");
const { Schema, model } = mongoose;
/**
 * 点赞表
 */
const tourism_zanSchema = new Schema(
  {
    user_id: String,
    diary_id: String, //每个人只能点赞一次
    zan_type: { type: Number, default: 1 },
    create_dtme: String,
  },
  { versionKey: false }
);
tourism_zanSchema.pre("save", function (next) {
  this.create_dtme = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});
module.exports = model("tourism_zan", tourism_zanSchema, "tourism_zan");
