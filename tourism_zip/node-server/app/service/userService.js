const fs = require("fs");
const tourism_user_tags = require("../models/tourism_user_tags");
const tourism_user_report = require("../models/tourism_user_report");
const tourism_diary = require("../models/tourism_diary");
const tourism_user = require("../models/tourism_user");
const tourism_comment = require("../models/tourism_comment");

const tools = require("../../tools");
/**
 * 添加tag
 * @param {} req
 * @param {*} res
 * @returns
 */
async function addUserTags(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }
  req.body.user_id = req.headers.user.user_id;
  let result = await tourism_user_tags.create(req.body);
  res.send(result);
}
/**
 * 删除用户自定义标签
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function removeUserTags(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }
  let result = await tourism_user_tags.findByIdAndDelete(req.body._id);
  res.send(result);
}
/**
 * 获取用户自定义标签
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getUserTags(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }
  let result = await tourism_user_tags.find({
    user_id: req.headers.user.user_id,
  });
  res.send(result);
}

/**
 *
 * 评论举报
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function addCommentReport(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }
  req.body.user_id = req.headers.user.user_id;
  let result = await tourism_user_report.create(req.body);
  res.send(result);
}

/**
 * 获取评论举报
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getCommentReport(req, res) {
  let page = { startPage: 1, pageSize: 15 };
  if (req.body.page) {
    page.startPage = parseInt(req.body.page.startPage);
    page.pageSize = parseInt(req.body.page.pageSize);
  }
  const query = {};
  const offset = (page.startPage - 1) * page.pageSize;
  const total = await tourism_user_report.countDocuments(); // 获取总数
  const items = await tourism_user_report
    .find(query)
    .sort({
      create_dtme: -1,
    })
    .skip(offset)
    .limit(page.pageSize)
    .lean();
  for (let item of items) {
    item.user = await tourism_user.findById(item.user_id).select("user_name");
  }
  page.totalResult = total;
  res.send({
    items,
    page,
  });
}

/**
 * 管理员获取评论
 */
async function getAdminComment(req, res) {
  let page = { startPage: 1, pageSize: 15 };
  if (req.body.page) {
    page.startPage = parseInt(req.body.page.startPage);
    page.pageSize = parseInt(req.body.page.pageSize);
  }
  const query = {};
  const offset = (page.startPage - 1) * page.pageSize;
  const total = await tourism_comment.countDocuments(); // 获取总数
  const items = await tourism_comment
    .find(query)
    .sort({
      create_dtme: -1,
    })
    .skip(offset)
    .limit(page.pageSize)
    .lean();
  for (let item of items) {
    item.user = await tourism_user.findById(item.user_id).select("user_name");
    item.diary = await tourism_diary.findById(item.diary_id).select("title");
  }
  page.totalResult = total;
  res.send({
    items,
    page,
  });
}
/**
 * 管理员审核
 * @param {*} req
 * @param {*} res
 * @returns
 */

async function examineDiary(req, res) {
  let result = await tourism_diary.findByIdAndUpdate(req.body._id, {
    examine_status: 1,
  });
  res.send(result);
}
/**
 * 管理员端分页获取所有游记
 */
async function getAdminDiary(req, res) {
  let page = { startPage: 1, pageSize: 15 };
  if (req.body.page) {
    page.startPage = parseInt(req.body.page.startPage);
    page.pageSize = parseInt(req.body.page.pageSize);
  }
  const query = {};
  const offset = (page.startPage - 1) * page.pageSize;
  const total = await tourism_diary.countDocuments(); // 获取总数
  const items = await tourism_diary
    .find(query)
    .sort({
      create_dtme: -1,
    })
    .skip(offset)
    .limit(page.pageSize)
    .lean();
  for (let item of items) {
    item.user = await tourism_user.findById(item.user_id).select("user_name");
  }
  page.totalResult = total;
  res.send({
    items,
    page,
  });
}
module.exports = {
  addUserTags,
  removeUserTags,
  getUserTags,
  addCommentReport,
  getCommentReport,
  examineDiary,
  getAdminDiary,
  getAdminComment,
};
