const axios = require("axios");
const { Stock } = require("../../models/Stock");

const { log } = console;

module.exports = {
  buildStocks,
  findExistingStock,
  findAndUpdateExistingStock,
  findStockAndCountLikes,
  formatData,
  formatDoc,
  formatUrl,
  getOldAndNonExistingStocks,
  getStocks,
  nowMilli,
  saveStock
};

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

async function getStocks(url) {
  if (url === "undefined" || url === undefined)
    new Error("Cannot request stocks, url is undefined!");
  try {
    return await axios.get(url);
  } catch (error) {
    console.error("AXIOS ERROR");
    console.error(error);
  }
}

function formatUrl(stock) {
  return new Promise((resolve, reject) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${
      process.env.REACT_APP_ALPHA_VANTAGE_KEY
    }`;
    resolve(url);
  });
}

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
    price: dailyHigh
  };
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
        // let ditchEmpties = uniqueIps.filter(item => item.length > 1);
        let likeCount = uniqueIps.length;
        if (err) reject(err);
        resolve(likeCount);
      });
  });
}

async function getOldAndNonExistingStocks(stocksArr) {
  return await Promise.all(
    stocksArr.map(async stockResult => {
      if (stockResult.message === "No stock found") {
        return await getStocks({ stock: stockResult.stock });
      }
      return stockResult;
    })
  );
}

function nowMilli() {
  let rightNow = new Date();

  return rightNow.getTime();
}

async function formatDoc(doc) {
  return {
    stock: doc.stock,
    price: doc.price.toString(),
    updatedAt: doc.updatedAt,
    likes: await findStockAndCountLikes({ stock: doc.stock })
  };
}

async function buildStocks(stockDocs, ip) {
  return await Promise.all(
    stockDocs.map(async stockResult => {
      if (stockResult.message === "No stock found") {
        let makeUrl = await formatUrl(stockResult.stock);
        let stockFromApi = await getStocks(makeUrl);
        let { data } = stockFromApi;
        let prepForDb = await formatData(data);
        prepForDb.IPAdresses = ip;
        let stockSavedToDb = await saveStock(prepForDb).catch(e =>
          console.error(e)
        );
        let formattedReturn = await formatDoc(stockSavedToDb);
        formattedReturn.likes = await findStockAndCountLikes({
          stock: stockResult.stock
        });
        return formattedReturn;
      }

      let docMilli = stockResult[0].updatedAt.getTime();
      let age = nowMilli() - docMilli;

      if (age > 60000) {
        let makeUrl = await formatUrl(stockResult[0].stock);
        let stockFromApi = await getStocks(makeUrl);
        let { data } = stockFromApi;
        let prepForDb = await formatData(data);
        prepForDb.IPAdresses = ip;

        // this needss to be findandupdate
        let stockSavedToDb = await findAndUpdateExistingStock(prepForDb).catch(
          e => {
            console.error(e.message);
          }
        );
        let formattedReturn = await formatDoc(stockSavedToDb);
        formattedReturn.likes = await findStockAndCountLikes({
          stock: stockResult[0].stock
        });
        return formattedReturn;
      }
      let formattedReturn = await formatDoc(stockResult[0]);

      return formattedReturn;
    })
  ).then(data => {
    data[0].rel_likes = data[0].likes - data[1].likes;
    data[1].rel_likes = data[1].likes - data[0].likes;
    return data;
  });
}
