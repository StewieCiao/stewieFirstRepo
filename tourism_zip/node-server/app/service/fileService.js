const fs = require("fs");
const tourism_file = require("../models/tourism_file");
const https_file_prefix_access_path = "http://localhost:3333/tourism/getFile/";
const mime = require("mime-types"); //需npm安装

async function uploadFile(req, res) {
  let files = req.files;
  let newArr = [];
  if (files) {
    if (Array.isArray(files)) {
      newArr = files;
    } else {
      newArr.push(files);
    }
  }

  let result = [];
  for (const element of newArr) {
    let file_name =
      currentTimeMillis() + "." + element.originalname.split(".")[1];
    const reader = fs.createReadStream(element.path);
    const file_path = process.cwd() + "/uploads/" + file_name;
    // 1、创建可写流
    const upStream = fs.createWriteStream(file_path);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    let access_path = https_file_prefix_access_path + file_name;
    await tourism_file.create({
      file_name: element.originalname,
      file_mapping_name: file_name,
      file_path: file_path,
      access_path: access_path,
    });
    result.push(access_path);
  }

  res.send(result);
  // return result;
}
function currentTimeMillis() {
  var date = new Date();
  var yy = date.getYear();
  var MM = date.getMonth() + 1;
  var dd = date.getDay();
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();
  var sss = date.getMilliseconds();
  return -Date.UTC(yy, MM, dd, hh, mm, ss, sss);
}
async function getFile(req, res) {
  let fileObj = await tourism_file.findOne({
    file_mapping_name: req.params.file_name,
  });
  console.log("req.params", req.params);
  //   res.send(result);
  let file = fs.readFileSync(fileObj.file_path); //读取文件
  let mimeType = mime.lookup(fileObj.file_path); //读取图片文件类型
  console.log("mimeType::" + mimeType);
  res.set("content-type", "application/octet-stream;charset=UTF8"); //设置返回类型
  res.set(
    "content-disposition",
    "attachment; filename=" + encodeURIComponent(file.file_mapping_name)
  ); //设置返回类型
  res.send(file);
}
module.exports = {
  uploadFile,
  getFile,
};
