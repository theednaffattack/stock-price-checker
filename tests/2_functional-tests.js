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

const { Stock } = require("../models/Stock");

chai.use(chaiHttp);

var likes = 0;

let idForDeletionTest = "";

suite("Functional Tests", function() {
  // STOCK CHALLENGE
  suite("GET /api/stock-prices => stockData object", function() {
    console.log(
      "\n\nREMOVING ITEMS FROM THE `STOCKS` COLLECTION FOR TESTING\n\n"
    );
    Stock.deleteMany({}, function(err) {
      if (err) console.error("ERRROR CLEARING COLLECTION FOR TESTS!!!");
      console.log("All items in the collection have been removed");
    });
    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end(function(err, res) {
          // likes = res.body.stockData.likes || 0;
          assert.equal(res.status, 200);
          assert.isString(res.body.stockData.stock);
          assert.isString(res.body.stockData.price);
          assert.isNumber(res.body.stockData.likes);
          done();
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "msft", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.likes, likes + 1);
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.likes, likes + 1);
          done();
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["amzn", "ebay"] })
        .end(function(err, res) {
          const result = res.body;
          assert.equal(res.status, 200);
          assert.isArray(result.stockData);
          assert.equal(result.stockData[0].stock, "AMZN");
          assert.equal(result.stockData[1].stock, "EBAY");
          assert.isString(result.stockData[0].price);
          assert.isString(result.stockData[1].price);
          assert.equal(result.stockData[0].rel_likes, 0);
          assert.equal(result.stockData[1].rel_likes, 0);
          done();
        });
    });

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["amzn", "ebay"], like: true })
        .end(function(err, res) {
          var result = res.body;
          assert.equal(res.status, 200);
          assert.isArray(result.stockData);
          assert.equal(result.stockData[0].stock, "AMZN");
          assert.equal(result.stockData[1].stock, "EBAY");
          assert.isString(result.stockData[0].price);
          assert.isString(result.stockData[1].price);
          assert.equal(result.stockData[0].rel_likes, 0);
          assert.equal(result.stockData[1].rel_likes, 0);
          done();
        });
    });
  });

  // PERSONAL LIBRARY CHALLENGE
  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "Test title"
            })
            .end(function(err, res) {
              let { _id, commentcount, comments } = res.body;
              assert.property(
                res.body,
                "_id",
                "res.body should contain an `_id` property."
              );
              assert.property(
                res.body,
                "commentcount",
                "the property `commentcount` should be present"
              );
              assert.property(
                res.body,
                "comments",
                "the property `comments` should be present"
              );
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send()
            .end(function(err, res) {
              assert.equal(
                res.text,
                "Save validation failed. Expected a `title` field of type String."
              );
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        this.timeout(10000);
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.isArray(res.body, "Response body should be an array");
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/1234")
          .end(function(err, res) {
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/5c9065a8e729a04e623f0923")
          .end(function(err, res) {
            assert.property(res.body, "_id");
            assert.property(res.body, "comments");
            // assert.isArray(res.body, "comments");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/5c9065a8e729a04e623f0923")
            .send({ comment: "A test comment" })
            .end(function(err, res) {
              assert.property(res.body, "_id");
              assert.property(res.body, "title");
              assert.property(res.body, "commentcount");
              assert.property(res.body, "comments");
              assert.isArray(
                res.body.comments,
                "Should be an array of comments"
              );
              done();
            });
        });
      }
    );
  });

  // ISSUE TRACKER CHALLENGE
  suite("All issue tracker stuff", function() {
    suite("POST /api/issues/{project} => object with issue data", function() {
      test("Every field filled in", function(done) {
        chai
          .request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "Title",
            issue_text: "text",
            created_by: "Functional Test - Every field filled in",
            assigned_to: "Chai and Mocha",
            status_text: "In QA"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);

            idForDeletionTest = res.body._id;
            //fill me in too!
            assert.property(
              res.body,
              "issue_title",
              "Is `issue_title` present?"
            );

            assert.property(res.body, "issue_text", "Is `issue_text` present?");

            assert.property(res.body, "created_by", "Is `created_by` present?");

            assert.property(
              res.body,
              "assigned_to",
              "Is `assigned_to` present?"
            );

            assert.property(
              res.body,
              "status_text",
              "Is `status_text` present?"
            );

            done();
          });
      });

      test("Required fields filled in", function(done) {
        chai
          .request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "Title",
            issue_text: "text",
            created_by: "Functional Test - Every field filled in"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);

            assert.property(
              res.body,
              "issue_title",
              "Is `issue_title` present?"
            );

            assert.property(res.body, "issue_text", "Is `issue_text` present?");

            assert.property(res.body, "created_by", "Is `created_by` present?");

            done();
          });
      });

      test("Missing required fields", function(done) {
        chai
          .request(server)
          .post("/api/issues/test")
          .send({
            // issue_title: "Title",
            // issue_text: "text",
            // created_by: "Functional Test - Every field filled in"
            assigned_to: "Chai and Mocha",
            status_text: "In QA"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.include(
              res.text,
              "Required field(s) missing:",
              "Test response text for required fields missing"
            );

            done();
          });
      });
    });

    suite("PUT /api/issues/{project} => text", function() {
      test("No body", function(done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send()
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.include(res.text, "no updated fields sent");
          });
        done();
        // no updated fields sent
      });

      test("One field to update", function(done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            _id: idForDeletionTest,
            issue_title: "Smooth"
          })
          .end(function(err, res) {
            // do stuff here
            assert.equal(
              res.text,
              "successfully updated",
              "Update `issue_title`"
            );
            done();
          });
      });

      test("Multiple fields to update", function(done) {
        chai
          .request(server)
          .put("/api/issues/test")
          .send({
            _id: idForDeletionTest,
            issue_title: "Smoother",
            issue_text: "Some other things"
          })
          .end(function(err, res) {
            // do stuff here
            assert.equal(
              res.text,
              "successfully updated",
              "Update `issue_title` and `issue_text`"
            );
            done();
          });
      });
    });

    suite(
      "GET /api/issues/{project} => Array of objects with issue data",
      function() {
        test("No filter", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query()
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], "issue_title");
              assert.property(res.body[0], "issue_text");
              assert.property(res.body[0], "created_on");
              assert.property(res.body[0], "updated_on");
              assert.property(res.body[0], "created_by");
              // assert.property(res.body[0], "assigned_to");
              assert.property(res.body[0], "open");
              // assert.property(res.body[0], "status_text");
              assert.property(res.body[0], "_id");
              done();
            });
        });

        test("One filter", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({ created_by: "Functional Test - Every field filled in" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], "issue_title");
              assert.property(res.body[0], "issue_text");
              assert.property(res.body[0], "created_on");
              assert.property(res.body[0], "updated_on");
              assert.property(res.body[0], "created_by");
              // assert.property(res.body[0], "assigned_to");
              assert.property(res.body[0], "open");
              // assert.property(res.body[0], "status_text");
              assert.property(res.body[0], "_id");
              assert.equal(
                res.body[0].created_by,
                "Functional Test - Every field filled in"
              );
              done();
            });
        });

        test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({
              created_by: "Functional Test - Every field filled in",
              assigned_to: "Chai and Mocha",
              status_text: "In QA"
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], "issue_title");
              assert.property(res.body[0], "issue_text");
              assert.property(res.body[0], "created_on");
              assert.property(res.body[0], "updated_on");
              assert.property(res.body[0], "created_by");
              assert.property(res.body[0], "assigned_to");
              assert.property(res.body[0], "open");
              assert.property(res.body[0], "status_text");
              assert.property(res.body[0], "_id");
              assert.equal(
                res.body[0].created_by,
                "Functional Test - Every field filled in"
              );
              assert.equal(res.body[0].assigned_to, "Chai and Mocha");
              assert.equal(res.body[0].status_text, "In QA");
              done();
            });
        });
      }
    );

    suite("DELETE /api/issues/{project} => text", function() {
      test("No _id", function(done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({})
          .end(function(err, res) {
            assert.equal(res.text, "_id error");
            done();
          });
      });

      test("Valid _id", function(done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({ _id: idForDeletionTest })
          .end(function(err, res) {
            assert.equal(res.text, `deleted ${idForDeletionTest}`);
          });

        done();
      });
    });
  });

  // IMPERIAL / METRIC CONVERTER CHALLENGE
  suite("GET /api/convert => conversion object", function() {
    test("Convert 10L (valid input)", function(done) {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "10L" })
        .end(function(err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.initNum, 10);
          assert.equal(res.body.initUnit, "L");
          assert.approximately(res.body.returnNum, 2.64172, 0.1);
          assert.equal(res.body.returnUnit, "gal");
          done();
        });
    });

    test("Convert 32g (invalid input unit)", function(done) {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "32g" })
        .end(function(err, res) {
          // console.log(" VIEW RES");
          // console.log(res);
          assert.equal(
            res.text,
            "invalid unit",
            "Unknown unit 'g' of `32g` will return `invalid unit`"
          );
          done();
        });
    });

    test("Convert 3/7.2/4kg (invalid number)", function(done) {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "3/7.2/4kg" })
        .end(function(err, res) {
          assert.equal(
            res.text,
            "invalid number",
            "Unknown number '3/7.2/4' of `3/7.2/4kg` will return `invalid number`"
          );
          done();
        });
    });

    test("Convert 3/7.2/4kilomegagram (invalid number and unit)", function(done) {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "3/7.2/4kilomegagram" })
        .end(function(err, res) {
          assert.equal(
            res.text,
            "invalid number and unit",
            "If both number and units are wrong we return a message `invalid number and unit`"
          );
          done();
        });
    });

    test("Convert kg (no number)", function(done) {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "kg" })
        .end(function(err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(res.body.initNum, 1);
          assert.equal(res.body.initUnit, "kg");
          assert.approximately(res.body.returnNum, 2.20462, 0.1);
          assert.equal(res.body.returnUnit, "lbs");
          done();
        });
    });
  });
});
