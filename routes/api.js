/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;

const replyController = require("../controllers/replyController");
const threadController = require("../controllers/threadController");

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .get(threadController.threadGet)
    .post(threadController.threadPost)
    .put(threadController.threadPut)
    .delete(threadController.threadDelete);

  app
    .route("/api/replies/:board")
    .get(replyController.replyGet)
    .post(replyController.replyPost)
    .put(replyController.replyPut)
    .delete(replyController.replyDelete);
};
