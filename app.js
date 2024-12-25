require("dotenv").config();

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
const { bucketExists } = require("./lib/Minio");
const passport = require('passport');
const { jwtStrategy } = require('./lib/Auth');
const { CORS_ENABLED, ALLOWED_DOMAINS } = require("./config/environments");
var app = express();

console.log("🚀 ~ CORS_ENABLED:", CORS_ENABLED)

if (CORS_ENABLED === "true") {
  const allowedDomains = ALLOWED_DOMAINS.split(",");

  const corsOptions = {
    origin: (origin, callback) => {
      console.log("🚀 ~ origin:", origin);
      console.log("🚀 ~ allowedDomains.includes(origin):", allowedDomains.includes(origin));
      if (!origin || allowedDomains.includes(origin)) {
        callback(null, true);
      } else {
        console.log("🚀 ~ CORS:", "Not allowed by CORS");
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
} else {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
}


app.use(cors(corsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(customMorganLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

bucketExists();
app.use('/api', indexRouter);
app.use(passport.initialize());
passport.use('jwt', jwtStrategy)

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
