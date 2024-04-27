if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

var createError = require("http-errors");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const customMorganLogger = require("./lib/Morgan");
const config = require("./config/environments");
var indexRouter = require("./routes/index");
const Response = require("./lib/Response");
const chalk = require("chalk");
const cors = require('cors');




var app = express();

app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(customMorganLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use('/api', indexRouter);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  console.log(chalk.red(err));
  res.locals.error = req.app.get("env") === "development" ? err : {};
   res.status(err.statusCode).json({code:err.statusCode, error:err});
});

module.exports = app;
