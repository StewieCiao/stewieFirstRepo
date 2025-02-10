const userService = require("../service/userService");

module.exports = function (app) {
  app.route("/tourism/addUserTags").post(userService.addUserTags);
  app.route("/tourism/removeUserTags").post(userService.removeUserTags);
  app.route("/tourism/getUserTags").post(userService.getUserTags);
  app.route("/tourism/addCommentReport").post(userService.addCommentReport);
  app.route("/tourism/getCommentReport").post(userService.getCommentReport);
  app.route("/tourism/getAdminComment").post(userService.getAdminComment);
  app.route("/tourism/examineDiary").post(userService.examineDiary);
  app.route("/tourism/getAdminDiary").post(userService.getAdminDiary);
};
