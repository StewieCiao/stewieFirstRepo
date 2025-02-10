let res = {
  code: 0,
  msg: "success",
};
let commonPage = {
  pageSize: 15,
  startPage: 1,
};
const JWT = require("jsonwebtoken");
const JWTsecretKey = "zhangsan123zzzzz";
const md5PasswordSecret = "123";
const crypto = require("crypto"); //引入加密模块

async function doGetToken(user) {
  return await JWT.sign(
    {
      user_id: user._id,
      user_name: user.user_name,
    },
    JWTsecretKey,
    {
      expiresIn: "7d",
    }
  );
}
async function unsignToken(token) {
  return JWT.verify(token, JWTsecretKey);
}
function getMd5Password(password) {
  const md5 = crypto.createHash("md5");
  return md5.update(password + md5PasswordSecret).digest("hex");
}
//聚合
async function paginate(model, page, query) {
  if (!page) {
    page = commonPage;
  } else {
    page.startPage = parseInt(page.startPage);
    page.pageSize = parseInt(page.pageSize);
  }

  const offset = (page.startPage - 1) * page.pageSize;
  const total = await model.countDocuments(query); // 获取总数
  const items = await model
    .find(query)
    .sort({
      create_dtme: -1,
    })
    .skip(offset)
    .limit(page.pageSize)
    .lean();
  page.totalResult = total;
  return {
    items,
    page,
  };
}
//聚合
async function paginate1(model, page, query) {
  if (!page) {
    page = commonPage;
  } else {
    page.startPage = parseInt(page.startPage);
    page.pageSize = parseInt(page.pageSize);
  }

  const offset = (page.startPage - 1) * page.pageSize;
  const total = await model.countDocuments(query); // 获取总数
  const items = await model
    .find(query)
    .sort({
      zan_count: -1,
    })
    .skip(offset)
    .limit(page.pageSize)
    .lean();
  page.totalResult = total;
  return {
    items,
    page,
  };
}
module.exports = {
  doGetToken,
  unsignToken,
  paginate,
  getMd5Password,
  paginate1,
};
