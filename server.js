const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const internalIp = require("internal-ip");
const chalk = require("chalk");
const mongoose = require("mongoose");
const path = require("path");

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const log = console.log;

const port = process.env.REACT_APP_PORT || 7777;

app.set("trust proxy", "127.0.0.1");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

// connect to our database
// get rid of the single-quote wrapper (for heroku)
const connectionString = process.env.REACT_APP_MONGO_ATLAS_CONNECTION_STRING.replace(
  "'",
  ""
);

if (process.env.NODE_ENV === "production") {
  console.log("LOADING PRODUCTION BUILD");
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type("text")
    .send("Not Found");
});

var server = app.listen(port, async () => {
  const db = mongoose.connect(connectionString, {
    useNewUrlParser: true,
    dbName: "test",
    autoIndex: false
  });

  db.then(
    database => {
      console.log("we're connected to mongoDB!");
    },
    err => {
      console.error(err);
    }
  ).catch(err => {
    console.error(err);
  });
  console.log(
    `

    ${chalk.magentaBright("Your backend server is running.")}
    ${chalk.yellowBright(
      "Local:"
    )}            http://localhost:${chalk.yellowBright(port)}
    ${chalk.yellowBright(
      "On Your Network:"
    )}  http://${await internalIp.v4()}:${chalk.yellowBright(port)}
    
    `
  );

  // if (process.env.NODE_ENV === "test") {

  console.log("Running Tests...");
  setTimeout(function() {
    try {
      runner.run();
    } catch (e) {
      var error = e;
      console.log("Tests are not valid:");
      console.log(error);
    }
  }, 5500);

  // }
});

module.exports = server;
