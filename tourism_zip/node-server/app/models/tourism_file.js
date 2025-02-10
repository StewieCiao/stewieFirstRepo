const mongoose = require("mongoose");
const moment = require("moment");
const { Schema, model } = mongoose;
/**
 * 文件表
 */
const tourism_fileSchema = new Schema(
  {
    file_name: String,
    file_mapping_name: String,
    file_path: String,

    access_path: String,
    create_dtme: String,
  },
  { versionKey: false }
);
tourism_fileSchema.pre("save", function (next) {
  this.create_dtme = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});
module.exports = model("tourism_file", tourism_fileSchema, "tourism_file");
