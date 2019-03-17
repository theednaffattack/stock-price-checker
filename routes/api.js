/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const stockController = require("../controllers/stockController");

const {
  booksGetController,
  booksDeleteAllController,
  booksDeleteOneController,
  booksPostController
} = require("../controllers/booksController");

const {
  deleteIssueController,
  getIssueController,
  postIssueController,
  putIssueController
} = require("../controllers/issueController");

module.exports = function(app) {
  // Stock Market API
  app.route("/api/stock-prices").get(stockController);

  // Personal Library API
  app.route("/api/books").get(booksGetController);
  app.route("/api/books").post(booksPostController);
  app.route("/api/books/:id").get(booksGetController);
  app.route("/api/books/:id").post(booksPostController);
  app.route("/api/books/:id").delete(booksDeleteOneController);
  app.route("/api/books").delete(booksDeleteAllController);

  // Issue Tracker API
  app.route("/api/issues/:project").delete(deleteIssueController);
  app.route("/api/issues/:project").get(getIssueController);
  app.route("/api/issues/:project").post(postIssueController);
  app.route("/api/issues/:project").put(putIssueController);
};
