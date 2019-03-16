/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const { log } = console;

const axios = require("axios");

const uniqueArrayPlugin = require("mongoose-unique-array");
// const stringify = require("json-stringify-safe");
// const queryString = require("querystring");

// const stock = "MSFT";

const { Stock } = require("../models/Stock");

const stockController = require("../controllers/stockController");
const {
  booksGetController,
  booksDeleteAllController,
  booksDeleteOneController,
  booksPostController
} = require("../controllers/booksController");

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
};
