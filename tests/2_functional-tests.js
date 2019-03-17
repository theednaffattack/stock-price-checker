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
          done();
        });

        test("Test POST /api/books with no title given", function(done) {
          done();
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        done();
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        done();
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          done();
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

            //fill me in too!

            done();
          });
      });

      test("Required fields filled in", function(done) {});

      test("Missing required fields", function(done) {});
    });

    suite("PUT /api/issues/{project} => text", function() {
      test("No body", function(done) {});

      test("One field to update", function(done) {});

      test("Multiple fields to update", function(done) {});
    });

    suite(
      "GET /api/issues/{project} => Array of objects with issue data",
      function() {
        test("No filter", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({})
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
              done();
            });
        });

        test("One filter", function(done) {});

        test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {});
      }
    );

    suite("DELETE /api/issues/{project} => text", function() {
      test("No _id", function(done) {});

      test("Valid _id", function(done) {});
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
          assert.equal(res.status, 200);
          assert.equal(res.body.initNum, 10);
          assert.equal(res.body.initUnit, "L");
          assert.approximately(res.body.returnNum, 2.64172, 0.1);
          assert.equal(res.body.returnUnit, "gal");
          done();
        });
    });

    test("Convert 32g (invalid input unit)", function(done) {
      //done();
    });

    test("Convert 3/7.2/4kg (invalid number)", function(done) {
      //done();
    });

    test("Convert 3/7.2/4kilomegagram (invalid number and unit)", function(done) {
      //done();
    });

    test("Convert kg (no number)", function(done) {
      //done();
    });
  });
});
