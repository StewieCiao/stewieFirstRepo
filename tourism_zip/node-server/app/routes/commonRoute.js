// const posts = require("../controllers/commonController");
const tourismService = require("../service/tourismService");
const fileService = require("../service/fileService");
const multer = require("multer");

module.exports = function (app) {
  app.route("/tourism/loginRegister").post(tourismService.loginRegister);
  app.route("/tourism/saveUser").post(tourismService.saveUser);
  app.route("/tourism/saveDiary").post(tourismService.saveDiary);
  app.route("/tourism/getDiary").post(tourismService.getDiary);
  app.route("/tourism/getMyDiary").post(tourismService.getMyDiary);
  app.route("/tourism/deleteDiary").post(tourismService.deleteDiary);
  app.route("/tourism/publishDiary").post(tourismService.publishDiary);
  app.route("/tourism/closeDiary").post(tourismService.closeDiary);

  app.route("/tourism/removeComment").post(tourismService.removeComment);
  app.route("/tourism/removeCollect").post(tourismService.removeCollect);
  app.route("/tourism/collectDiary").post(tourismService.collectDiary);
  app
    .route("/tourism/getMyCollectDiary")
    .post(tourismService.getMyCollectDiary);
  app.route("/tourism/getComment").post(tourismService.getComment);
  app.route("/tourism/commentDiary").post(tourismService.commentDiary);
  app.route("/tourism/zanDiary").post(tourismService.zanDiary);

  app
    .route("/tourism/getMyCollectDiary")
    .post(tourismService.getMyCollectDiary);

  //app.route("/tourism/uploadFile").post(fileService.uploadFile);
  app.route("/tourism/getFile/:file_name").get(fileService.getFile);

  // 设置文件上传路由
  // middlewares

  // 配置Multer存储引擎
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // 文件将被保存到uploads目录下
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "." + file.originalname.split(".")[1]); // 文件名由字段名和时间戳组成
    },
  });

  // 创建Multer实例
  const upload = multer({ storage: storage });
  app.post("/tourism/uploadFile", upload.array("files", 12), (req, res) => {
    fileService.uploadFile(req, res);
    // try {
    //   // 文件上传成功后，返回成功信息
    //   if (req.files) {
    //     // 文件上传成功
    //     res.send("Files uploaded successfully.");
    //   } else {
    //     res.send("No files were uploaded.");
    //   }
    //   //res.status(200).send({ message: "File uploaded successfully" });
    // } catch (error) {
    //   // 处理上传过程中的错误
    //   res
    //     .status(500)
    //     .send({ message: "Error uploading file", error: error.message });
    // }
  });
  //   app.route("/getAllPost").post(posts.getAllPost);

  //   app.route("/add_post").post(posts.add_post);

  //   app.route("/feed").get(posts.feed);

  //   app
  //     .route("/posts/:post_id")
  //     .get(posts.get_post)
  //     .patch(posts.update_post)
  //     .delete(posts.delete_post);

  //   app
  //     .route("/posts/:post_id/like")
  //     .post(posts.add_like)
  //     .delete(posts.remove_like);
};
