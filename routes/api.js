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
const booksController = require("../controllers/booksController");

module.exports = function(app) {
  app.route("/api/stock-prices").get(stockController);

  app.route("/api/books/:id").post(booksController);
  app.route("/api/books").get(booksController);
};
