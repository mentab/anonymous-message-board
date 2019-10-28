/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

var thread_id_1 = null;
var thread_id_2 = null;
var reply_id_1 = null;
var reply_id_2 = null;

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("POST with all fields", function(done) {
        chai
          .request(server)
          .post("/api/threads/general")
          .send({
            text: "text",
            delete_password: "delete_password"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.redirects);
            assert.equal(res.redirects.length, 1);
            done();
          });
      });

      test("POST with missing fields", function(done) {
        chai
          .request(server)
          .post("/api/threads/general")
          .send({
            text: "text"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "error");
          });
        chai
          .request(server)
          .post("/api/threads/general")
          .send({
            text: "text"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "error");
            done();
          });
      });
    });

    suite("GET", function() {
      test("GET with existing thread", function(done) {
        chai
          .request(server)
          .get("/api/threads/general")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], "created_on");
            assert.isArray(res.body[0]["replies"]);
            assert.isAtMost(res.body[0]["replies"].length, 3);
            assert.property(res.body[0], "text");
            assert.property(res.body[0], "_id");
            assert.notProperty(res.body[0], "reported");
            assert.notProperty(res.body[0], "delete_password");
            thread_id_1 = res.body[0]._id;
            thread_id_2 = res.body[1]._id;
            done();
          });
      });
      test("GET with non existing thread", function(done) {
        chai
          .request(server)
          .get("/api/threads/generaleeee")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.isEmpty(res.body);
            done();
          });
      });
    });

    suite("PUT", function(done) {
      test("PUT with non existing thread", function(done) {
        chai
          .request(server)
          .put("/api/threads/general")
          .send({
            report_id: "bad_thread_id"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "error");
            done();
          });
      });
      test("PUT with existing thread", function(done) {
        chai
          .request(server)
          .put("/api/threads/general")
          .send({
            report_id: thread_id_1
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("DELETE with non existing thread", function(done) {
        chai
          .request(server)
          .delete("/api/threads/general")
          .send({
            thread_id: "bad_thread_id",
            delete_password: "bad_password"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });
      test("DELETE with existing thread", function(done) {
        chai
          .request(server)
          .delete("/api/threads/general")
          .send({
            thread_id: thread_id_1,
            delete_password: "delete_password"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function(done) {
      test("POST with all fields", function(done) {
        chai
          .request(server)
          .post("/api/replies/general")
          .send({
            text: "text",
            delete_password: "delete_password",
            thread_id: thread_id_2
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.redirects);
            assert.equal(res.redirects.length, 1);
            done();
          });
        chai
          .request(server)
          .post("/api/replies/general")
          .send({
            text: "text",
            delete_password: "delete_password",
            thread_id: thread_id_2
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.redirects);
            assert.equal(res.redirects.length, 1);
          });
      });

      test("POST with missing fields", function(done) {
        chai
          .request(server)
          .post("/api/replies/general")
          .send({
            text: "text",
            delete_password: "delete_password"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "error");
            done();
          });
      });
    });

    suite("GET", function(done) {
      test("GET with bad thread id", function(done) {
        chai
          .request(server)
          .get("/api/replies/general?thread_id=bad_thread_id")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "error");
            done();
          });
      });
      test("GET with existing thread id", function(done) {
        chai
          .request(server)
          .get("/api/replies/general?thread_id=" + thread_id_2)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, "bumped_on");
            assert.property(res.body, "created_on");
            assert.isArray(res.body.replies);
            assert.property(res.body, "text");
            assert.property(res.body, "_id");
            assert.notProperty(res.body, "reported");
            assert.notProperty(res.body, "delete_password");
            reply_id_1 = res.body.replies[0]._id;
            reply_id_2 = res.body.replies[1]._id;
            done();
          });
      });
    });

    suite("PUT", function(done) {
      test("PUT with existing reply id", function(done) {
        chai
          .request(server)
          .put("/api/replies/general")
          .send({
            thread_id: thread_id_2,
            reply_id: reply_id_1
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
      test("PUT with non existing reply id", function(done) {
        chai
          .request(server)
          .put("/api/replies/general")
          .send({
            thread_id: "bad_thread_id",
            reply_id: "bad_reply_id"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "error");
            done();
          });
      });
    });

    suite("DELETE", function(done) {
      test("DELETE with non existing reply id", function(done) {
        chai
          .request(server)
          .delete("/api/replies/general")
          .send({
            thread_id: "bad_thread_id",
            reply_id: "bad_reply_id",
            delete_password: "bad_password"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });
      test("DELETE with existing reply id", function(done) {
        chai
          .request(server)
          .delete("/api/replies/general")
          .send({
            thread_id: thread_id_2,
            reply_id: reply_id_2,
            delete_password: "delete_password"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });
  });
});
