const fs = require("fs");
const tourism_collect = require("../models/tourism_collect");
const tourism_comment = require("../models/tourism_comment");
const tourism_diary = require("../models/tourism_diary");
const tourism_user = require("../models/tourism_user");
const tourism_zan = require("../models/tourism_zan");
const tools = require("../../tools");

/**
 * 注册/登录
 */
async function loginRegister(req, res) {
  let user = await tourism_user.findOne({ user_name: req.body.user_name });
  let result = {};
  let md5Password = tools.getMd5Password(req.body.password);
  if (user) {
    if (md5Password !== user.password) {
      result = {
        code: -1,
        msg: "密码错误",
      };
    } else {
      result = {
        code: 0,
        id: user._id,
        tags: user.tags,
        user_img: user.user_img,

        user_name: req.body.user_name,
        token: await tools.doGetToken(user),
      };
    }
  } else {
    //注册
    await tourism_user.create({
      user_name: req.body.user_name,
      password: md5Password,
    });
    user = await tourism_user.findOne({ user_name: req.body.user_name });
    result = {
      code: 0,
      id: user._id,
      tags: user.tags,
      user_img: user.user_img,
      user_name: req.body.user_name,
      token: await tools.doGetToken(user),
    };
  }
  res.send(result);
}
async function deleteDiary(req, res) {
  let result = await tourism_diary.findByIdAndDelete(req.body._id);
  res.send(result);
}
async function publishDiary(req, res) {
  let result = await tourism_diary.findByIdAndUpdate(req.body._id, {
    publish_status: 1,
  });
  res.send(result);
}
async function closeDiary(req, res) {
  let result = await tourism_diary.findByIdAndUpdate(req.body._id, {
    publish_status: 0,
  });
  res.send(result);
}
/**
 * 修改用户信息
 * 头像
 * 标签
 *  user_name: String, //用户名
    password: String, //密码
    user_img: String,
    tags: Array, //个人标签 用来个性推送游记
    create_dtme: String, //注册时间
 */
async function saveUser(req, res) {
  let result = await tourism_user.findByIdAndUpdate(req.body.id, req.body);
  res.send(result);
}

/**
 * 创建游记
 * 游记标题
 * 游记图片
 * 游记内容
 * 游记标签
 * 创建人
 * 创建时间等
 */
async function saveDiary(req, res) {
  let result = {};
  if (req.body._id) {
    //修改
    result = await tourism_diary.findByIdAndUpdate(req.body._id, req.body);
  } else {
    //新增
    req.body.user_id = req.headers.user.user_id;
    result = await tourism_diary.create(req.body);
  }
  res.send(result);
}
async function getUserInfo(userId) {
  return await tourism_user.findById(userId);
}

/**
 * 搜索
 * 分页
 * @param {*} req
 * @param {*} res
 */
async function getDiary(req, res) {
  let user_id = req.headers.user ? req.headers.user.user_id : "";

  //模糊搜索
  let query = {};
  if (req.body.name) {
    let pattern = new RegExp(req.body.name);
    query = {
      $or: [
        {
          title: pattern,
        },
        {
          share_content: pattern,
        },
      ],
    };
  }
  query.status = 1;
  query.publish_status = 1;
  query.examine_status = 1; //管理员审核标记

  if (req.body.tags && req.body.tags.length > 0) {
    //标签搜索
    query["tags"] = { $in: req.body.tags };
  } else {
    if (user_id) {
      //特殊推送 根据标签来匹配
      let userInfo = await getUserInfo(user_id);
      if (userInfo.tags && userInfo.tags.length > 0) {
        let tags = [];
        for (let o of userInfo.tags) {
          tags.push(o.name);
        }
        query["tags"] = { $in: tags };
      }
    }
  }

  let result = [];
  if (req.body.hot && req.body.hot == "热门") {
    result = await tools.paginate1(tourism_diary, req.body.page, query);
  } else {
    result = await tools.paginate(tourism_diary, req.body.page, query);
  }
  for (let diary of result.items) {
    diary.userInfo = await getUserInfo(diary.user_id);
    //查看是否已经点赞 收藏
    if (user_id) {
      diary.selfCollect = await tourism_collect.countDocuments({
        user_id: user_id,
        diary_id: diary._id,
      });
      diary.selfZan = await tourism_zan.countDocuments({
        user_id: user_id,
        diary_id: diary._id,
      });
    }
  }
  res.send(result);
}
async function getMyDiary(req, res) {
  let query = { user_id: req.headers.user.user_id, status: 1 };
  let result = await tools.paginate(tourism_diary, req.body.page, query);
  res.send(result);
}
async function getMyCollectDiary(req, res) {
  let collect = await tourism_collect.find({
    user_id: req.headers.user.user_id,
  });
  let result = [];
  /**
   * 获取所有的评论 点赞数 用户
   **/
  for (const element of collect) {
    let diary = await tourism_diary
      .findOne({ _id: element.diary_id, status: 1 })
      .lean();
    if (diary) {
      diary.userInfo = await getUserInfo(diary.user_id);
      diary._id = element._id;
      result.push(diary);
    }
  }

  res.send({ items: result });
}
/**
 * 收藏收藏
 */
async function collectDiary(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }
  let count = await tourism_collect.countDocuments({
    user_id: req.headers.user.user_id,
    diary_id: req.body.dirary_id,
  });
  if (count && count > 0) {
    res.send({ code: -1, msg: "收藏过啦" });
  } else {
    let result = await tourism_collect.create({
      user_id: req.headers.user.user_id,
      diary_id: req.body.dirary_id,
    });
    await tourism_diary.findByIdAndUpdate(req.body.dirary_id, {
      $inc: { collect_count: 1 },
    });
    res.send(result);
  }
}
/**
 * 删除收藏
 */
async function removeCollect(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }
  let result = await tourism_collect.findByIdAndDelete(req.body._id);
  res.send(result);
}
/**
 * 获取游记评论
 */
async function getComment(req, res) {
  let result = await tourism_comment
    .find({
      diary_id: req.body.dirary_id,
    })
    .lean();
  for (const element of result) {
    element.userInfo = await getUserInfo(element.user_id);
  }
  res.send(result);
}
/**
 * 添加评论
 */
async function commentDiary(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }
  let result = await tourism_comment.create({
    user_id: req.headers.user.user_id,
    diary_id: req.body.dirary_id,
    comment: req.body.comment,
  });
  await tourism_diary.findByIdAndUpdate(req.body.dirary_id, {
    $inc: { comment_count: 1 },
  });
  res.send(result);
}
/**
 * 删除评论
 */
async function removeComment(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }
  let result = await tourism_comment.findByIdAndDelete(req.body._id);
  res.send(result);
}
/**
 * 点赞
 * 取消点赞
 */
async function zanDiary(req, res) {
  if (!req.headers.user) {
    res.send({ code: -1, msg: "您还没有登录哦" });
    return;
  }

  if (req.body.zan_type) {
    await tourism_zan.findOneAndDelete({
      user_id: req.headers.user.user_id,
      diary_id: req.body.dirary_id,
    });
    await tourism_diary.findByIdAndUpdate(req.body.dirary_id, {
      $inc: { zan_count: -1 },
    });
  } else {
    await tourism_zan.create({
      user_id: req.headers.user.user_id,
      diary_id: req.body.dirary_id,
    });
    await tourism_diary.findByIdAndUpdate(req.body.dirary_id, {
      $inc: { zan_count: 1 },
    });
  }

  res.send({ code: 0 });
}

module.exports = {
  loginRegister,
  saveUser,
  saveDiary,
  getDiary,
  getMyDiary,
  collectDiary,
  getMyCollectDiary,
  removeCollect,
  commentDiary,
  removeComment,
  zanDiary,
  getComment,
  deleteDiary,
  publishDiary,
  closeDiary,
};
