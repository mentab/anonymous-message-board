const Board = require("../models/board");
const Thread = require("../models/thread");

exports.threadPost = function(req, res) {
  const thread = new Thread(req.body);
  thread.save(function(err) {
    if (err) return res.send("error");
    Board.findOneAndUpdate(
      { title: req.params.board },
      { $push: { threads: thread } },
      { upsert: true, useFindAndModify: false, returnNewDocument: true },
      function(err, board) {
        if (err) return res.send("error");
        return res.redirect("/b/" + board.title + "/");
      }
    );
  });
};

exports.threadGet = function(req, res) {
  Board.findOne({ title: req.params.board })
    .populate({
      path: "threads",
      select: "-reported -delete_password",
      options: {
        limit: 10,
        sort: {
          bumped_on: -1
        }
      },
      populate: {
        path: "replies",
        select: "-reported -delete_password",
        options: {
          sort: {
            bumped_on: -1
          }
        }
      }
    })
    .exec(function(err, board) {
      if (err || !(board && board.threads)) return res.send("error");
      return res.json(board.threads.map(thread => {
        // TODO use aggregate in request instead...
        let replies = thread.replies.slice(0, 3);
        thread.replies = replies;
        return thread;
      }));
    });
};

exports.threadDelete = function(req, res) {
  // TODO $pull board ?
  Thread.findOneAndRemove(
    { _id: req.body.thread_id, delete_password: req.body.delete_password },
    function(err, thread) {
      if (err) return res.send("incorrect password");
      return res.send("success");
    }
  );
};

exports.threadPut = function(req, res) {
  Thread.findOneAndUpdate(
    { _id: req.body.report_id },
    { $set: { reported: true } },
    { useFindAndModify: false, returnNewDocument: true },
    function(err, thread) {
      if (err || !thread) return res.send("error");
      return res.send("success");
    }
  );
};
