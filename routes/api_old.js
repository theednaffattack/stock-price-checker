/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
// var MongoClient = require("mongodb");

const { log } = console;

const axios = require("axios");

const uniqueArrayPlugin = require("mongoose-unique-array");
// const stringify = require("json-stringify-safe");
// const queryString = require("querystring");

// const stock = "MSFT";

const { Stock } = require("../models/Stock");

module.exports = function(app) {
  // GET ROUTES
  app.route("/api/hello").get(function(req, res) {
    res.send({ express: "Hello From Express" });
  });

  app.route("/api/stock-prices").get(async function(req, res) {
    log("VIEW REQ");
    log(req.query);
    log(req.ip);
    // log(Object.keys(req));
    log(req.headers["x-forwarded-for"]);
    // let ip = req.headers["x-forwarded-for"];
    let ip = req.ip;
    let { stock } = req.query;
    // console.log from req.query qbove
    // { stock: [ 'goog', 'msft' ], like: [ 'false', 'false' ] }
    function formatUrl(stock) {
      return new Promise((resolve, reject) => {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${
          process.env.REACT_APP_ALPHA_VANTAGE_KEY
        }`;
        resolve(url);
      });
    }

    function getTimeOfLastUpdate() {
      return new Promise((resolve, reject) => {
        Stock.findOne({}, {}, { sort: { createdAt: -1 } })
          .lean()
          .exec((err, doc) => {
            let now = new Date();
            let isoString = now.toISOString();
            if (err) return reject(err);
            if (!doc) return resolve(isoString);
            resolve(doc.updatedAt);
          });
      });
    }

    await getTimeOfLastUpdate();

    function formatData(data) {
      const meta = data["Meta Data"];
      const stockSymbol = meta["2. Symbol"];
      const lastRefreshed = meta["3. Last Refreshed"];
      const timeZone = meta["5. Time Zone"];
      const timeSeriesDaily = data["Time Series (Daily)"];
      const timeSeriesKeys = Object.keys(timeSeriesDaily);
      const dailyHigh = timeSeriesDaily[timeSeriesKeys[0]]["2. high"];
      return {
        stockSymbol,
        lastRefreshed,
        timeZone,
        dailyHigh
      };
    }

    async function getStocks(url) {
      if (url === "undefined" || url === undefined)
        new Error("url is undefined!");
      try {
        return await axios.get(url);
      } catch (error) {
        console.error("AXIOS ERROR");
        console.error(error);
      }
    }

    function findExistingStock(stock) {
      return new Promise((resolve, reject) => {
        Stock.find({ stock: stock.toUpperCase() }).exec((err, doc) => {
          if (err) return reject(err);
          if (doc.length === 0) {
            return resolve({ stock: stock, message: "No stock found" });
          }
          resolve(doc);
        });
      });
    }

    function findAndUpdateExistingStock({ stock, IPAdresses, price }) {
      return new Promise((resolve, reject) => {
        const query = { stock: stock.toUpperCase() };
        const findAndUpdate = Stock.findOneAndUpdate(
          query,
          {
            stock: stock.toUpperCase(),
            $push: { IPAdresses },
            price
          },
          { new: true, upsert: true }
        ).exec((err, doc) => {
          if (err) return reject(err);
          if (doc.length === 0) {
            resolve("No stock found");
          }
          resolve(doc);
        });
      });
    }

    function findStockAndCountLikes({ stock }) {
      return new Promise((resolve, reject) => {
        Stock.find({ stock: stock.toUpperCase() })
          .lean()
          .exec((err, doc) => {
            let uniqueIps = Array.from(new Set(doc[0].IPAdresses));
            let likeCount = uniqueIps.length;
            if (err) reject(err);
            resolve(likeCount);
          });
      });
    }

    function saveStock({ stock, IPAdresses, price }) {
      return new Promise((resolve, reject) => {
        const newStock = new Stock({
          stock: stock.toUpperCase(),
          price,
          IPAdresses
        });
        newStock.save((err, doc) => {
          if (err) reject(err);
          resolve(doc);
        });
      });
    }

    function formatDoc(doc) {
      return {
        stock: doc.stock,
        price: doc.price.toString(),
        updatedAt: doc.updatedAt
      };
    }

    if (Array.isArray(req.query.stock)) {
      const stockDocs = await Promise.all(
        req.query.stock.map(async (stock, index) => {
          return await findExistingStock(stock).catch(e =>
            console.error("PROMISE ERROR - formatUrl:\n" + e)
          );
        })
      );

      log(stockDocs.includes(""));

      // function buildProcessQueue(docs) {
      //   let [stockDocOne, stockDocTwo] = docs;

      //   let searchAndUpdate = [];
      //   let searchAndSave = [];

      //   stockDocOne;
      // }
      // if we've found docs then update them with search info

      // if we haven't then create them and return to client

      // let makeUrls = await Promise.all(
      //   stockDocs.map(async (stock, index) => {
      //     return await formatUrl(stock.stock).catch(e =>
      //       console.error("PROMISE ERROR - makeUrls => formatUrl:\n" + e)
      //     );
      //   })
      // );

      // let doubleStockReturnData = await Promise.all(
      //   makeUrls.map(async (stock, index) => {
      //     return await getStocks(stock).catch(e =>
      //       console.error(
      //         "«PROMISE ERROR - stockReturnData => getStocks:\n" + e
      //       )
      //     );
      //   })
      // );

      // let allData = await Promise.all(
      //   doubleStockReturnData.map(async () => {
      //     let finalData = await formatData(stockReturnData.data);
      //   })
      // );
      // let { stockSymbol: stock, dailyHigh: price } = finalData;

      let promises = await Promise.all(
        req.query.stock.map(async (stock, index) => {
          let makeUrl = await formatUrl(stock).catch(e =>
            console.error("PROMISE ERROR - formatUrl:\n" + e)
          );
          return await getStocks(makeUrl);
        })
      ).then(async data => {
        let [preOne, preTwo] = data;
        let {
          status: pOneStatus,
          statusText: pOneStatusTxt,
          data: pOneData
        } = preOne;
        let {
          status: pTwoStatus,
          statusText: pTwoStatusTxt,
          data: pTwoData
        } = preTwo;

        function formatData(data) {
          const meta = data["Meta Data"];
          const stockSymbol = meta["2. Symbol"];
          const lastRefreshed = meta["3. Last Refreshed"];
          const timeZone = meta["5. Time Zone"];
          const timeSeriesDaily = data["Time Series (Daily)"];
          const timeSeriesKeys = Object.keys(timeSeriesDaily);
          const dailyHigh = timeSeriesDaily[timeSeriesKeys[0]]["2. high"];
          return {
            stock: stockSymbol,
            updatedAt: lastRefreshed,
            timeZone,
            price: dailyHigh.toString()
          };
        }
        let returnArray = [formatData(pOneData), formatData(pTwoData)];

        let theFinalCountdown = await Promise.all(
          returnArray.map(async (item, index) => {
            let { stock, price, IPAdresses } = item;
            let likes = req.query.like
              ? req.query.like[index] === "true"
                ? ip
                : null
              : null;
            return await findAndUpdateExistingStock({
              stock: stock.toUpperCase(),
              price,
              IPAdresses: likes
            });
          })
        );

        let formatDocs = await Promise.all(
          theFinalCountdown.map(async item => {
            return await formatDoc(item);
          })
        );

        let getAllLikes = await Promise.all(
          req.query.stock.map(async (stock, index) => {
            return await findStockAndCountLikes({ stock });
          })
        );

        formatDocs[0].total_likes = !isNaN(getAllLikes[0]) ? getAllLikes[0] : 0;
        formatDocs[1].total_likes = !isNaN(getAllLikes[1]) ? getAllLikes[1] : 0;

        formatDocs[0].rel_likes =
          formatDocs[0].total_likes - formatDocs[1].total_likes;
        formatDocs[1].rel_likes =
          formatDocs[1].total_likes - formatDocs[0].total_likes;

        var dateFns = require("date-fns");
        let elapsedTimeSinceSearch =
          dateFns.getMilliseconds(Date.now()) -
          dateFns.getMilliseconds(await getTimeOfLastUpdate());
        res.status(200).send({ stockData: formatDocs });
        return;
      });
    }

    if (!Array.isArray(req.query.stock)) {
      const stockDoc = await findExistingStock(req.query.stock);
      let makeUrl = await formatUrl(req.query.stock).catch(e =>
        console.error("PROMISE ERROR - makeUrl => formatUrl:\n" + e)
      );
      let stockReturnData = await getStocks(makeUrl).catch(e =>
        console.error("«PROMISE ERROR - stockReturnData => getStocks:\n" + e)
      );
      let finalData = await formatData(stockReturnData.data);
      let { stockSymbol: stock, dailyHigh: price } = finalData;

      // if there is no existing stock in the db...
      if (
        stockDoc === "No stock found" ||
        stockDoc.message === "No stock found"
      ) {
        let saveFinal = await saveStock({
          stock,
          price,
          IPAdresses: req.query.like === "true" ? ip : ""
        }).catch(e => console.error(e));
        let formatFinal = {
          stock: saveFinal.stock,
          price: saveFinal.price.toString(),
          updatedAt: saveFinal.updatedAt
        };
        // COME BACK HERE
        let finalFinal = formatDoc(saveFinal);
        let likeCount = await findStockAndCountLikes({
          stock: finalFinal.stock
        });
        finalFinal.likes = await findStockAndCountLikes({
          stock: finalFinal.stock
        });
        res.status(200).send({ stockData: finalFinal });
        return;
      }

      // if there IS an existing stock in the db...
      if (
        stockDoc !== "No stock found" ||
        stockDoc.message !== "No stock found"
      ) {
        let getCount = await findStockAndCountLikes({ stock });
        let updateStock = await findAndUpdateExistingStock({
          stock: stock.toUpperCase(),
          price,
          IPAdresses: req.query.like === "true" ? ip : ""
        });
        let finalFinal = formatDoc(updateStock);
        finalFinal.likes = getCount || 0;
        log("view finalFinal");
        log(finalFinal);
        res.status(200).send({ stockData: finalFinal });
      }

      // I WANT THIS TO BE UNREACHABLE FOR NOW
      // res.status(200).send({ stockData: finalData });
      return;
    }

    // I WANT THIS TO BE UNREACHABLE FOR NOW
  });

  // POST ROUTES
  app.route("/api/world").post((req, res) => {
    console.log(req.body);
    res.send(
      `I received your POST request. This is what you sent me: ${req.body.post}`
    );
  });
};
