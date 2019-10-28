const Thread = require("../models/thread");
const Reply = require("../models/reply");

exports.replyPost = function(req, res) {
  const reply = new Reply({
    text: req.body.text,
    delete_password: req.body.delete_password
  });
  reply.save(function(err) {
    if (err) return res.send("error");
    Thread.findOneAndUpdate(
      { _id: req.body.thread_id },
      { $push: { replies: reply } },
      { useFindAndModify: false, returnNewDocument: true },
      function(err, thread) {
        if (err || !thread) return res.send("error");
        return res.redirect("/b/" + req.params.board + "/" + thread._id);
      }
    );
  });
};

exports.replyGet = function(req, res) {
  Thread.findOne({ _id: req.query.thread_id } ,"-reported -delete_password")
    .populate({
      path: "replies",
      select: "-reported -delete_password",
      options: {
        sort: {
          bumped_on: -1
        }
      }
    })
    .exec(function(err, thread) {
      if (err || !thread) return res.send("error");
      return res.json(thread);
    });
};

exports.replyDelete = function(req, res) {
  Reply.findOneAndUpdate(
    { _id: req.body.reply_id, delete_password: req.body.delete_password },
    { $set: { text: "[deleted]" } },
    { useFindAndModify: false },
    function(err, reply) {
      if (err || !reply) return res.send("incorrect password");
      return res.send("success");
    }
  );
};

exports.replyPut = function(req, res) {
  Reply.findOneAndUpdate(
    { _id: req.body.reply_id },
    { $set: { reported: true } },
    { useFindAndModify: false, returnNewDocument: true },
    function(err, reply) {
      if (err || !reply) return res.send("error");
      return res.send("success");
    }
  );
};
