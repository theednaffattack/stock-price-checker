const {
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
} = require("./utils/dataFetching");

module.exports = async function(req, res) {
  let ip = req.ip;
  let { stock, like } = req.query;

  like = like === "true" ? 1 : 0;

  let arrayTest = Array.isArray(stock) ? "isArray" : "isNotArray";

  // if the request is for a single stock...

  // ONE) check if it's in the db: DECISION:
  // ...if it's in the db && less than a minute old: ACTION: display
  // ...if it's older than a minute: ACTION: fetch, save, and display

  // TWO) if it's not in the db: ACTION: fetch, save, and display
  if (arrayTest === "isNotArray") {
    let stockDoc = await findExistingStock(stock).catch(e => console.error(e));

    let rightNow = new Date();
    let timeMilli = rightNow.getTime();

    if (stockDoc.message === "No stock found") {
      // fetch the stock and save to db
      // respond with db doc
      let readyUrl = await formatUrl(stockDoc.stock);
      let { data: fetchedStocks } = await getStocks(readyUrl);
      let formattedData = await formatData(fetchedStocks);
      let { stock, price } = formattedData;
      let savedStock = await saveStock({ stock, price, IPAdresses: ip });
      let readyToReturnDoc = await formatDoc(savedStock);
      readyToReturnDoc.likes = await findStockAndCountLikes({
        stock: savedStock.stock
      });
      return res.status(200).send({ stockData: readyToReturnDoc });
    }

    let docUpdated = new Date(stockDoc[0].updatedAt);

    let docMilli = docUpdated.getTime();

    if (nowMilli() - docMilli > 60000) {
      let readyUrl = await formatUrl(stockDoc[0].stock);
      let { data: fetchedStocks } = await getStocks(readyUrl);
      let formattedData = await formatData(fetchedStocks);
      let { stock, price } = formattedData;
      let savedStock = await findAndUpdateExistingStock({
        stock,
        price,
        IPAdresses: like ? ip : ""
      });
      let allLikes = await findStockAndCountLikes({
        stock: savedStock.stock
      });
      let readyToReturnDoc = await formatDoc(savedStock);
      readyToReturnDoc.likes = allLikes;
      return res.status(200).send({ stockData: readyToReturnDoc });
    }

    // if(stockDoc.updatedAt < 60 seconds ago) {
    if (nowMilli() - docMilli < 60000) {
      stockDoc[0].likes = await findStockAndCountLikes({
        stock: stockDoc[0].stock
      });
      stockDoc[0].price = stockDoc[0].price.toString();

      let readyToReturnDoc = await formatDoc(stockDoc[0]);
      readyToReturnDoc.price.toString();
      return res.status(200).send({
        stockData: readyToReturnDoc
      });
    }
  }

  // if the request is for a two stocks...

  // ONE) check BOTH to determine if they are in the db: DECISION:
  // ...IF BOTH are in the db && less than a minute old: ACTION: display
  // ...IF BOTH older than a minute: ACTION: fetch, save, and display

  // ...IF ONE is in the db && less than a minute old and THE OTHER is NOT IN THE DB
  // ...: ACTION: push ONE to queue. Then fetch, save & push THE OTHER to queue
  // ...: ACTION: display

  // ...IF ONE is in the db && older than a minute and THE OTHER is ALSO IN THE DB,
  // ...but less than a minute old: ACTION: push THE OTHER to queue. Then fetch,
  // ...save & push ONE to queue

  // TWO) if BOTH are not in the db: ACTION: fetch, save, and display

  if (arrayTest === "isArray") {
    const stockDocs = await Promise.all(
      stock.map(async (stock, index) => {
        return await findExistingStock(stock).catch(e =>
          console.error("PROMISE ERROR - formatUrl:\n" + e)
        );
      })
    );

    // let buildStocks = await getOldAndNonExistingStocks(stockDocs);

    let preparedResponse = await buildStocks(stockDocs, ip);

    res.status(200).send({
      stockData: preparedResponse
    });
  }
};
