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

var app = express();
app.set('trust proxy', true);
console.log('ALLOWED_DOMAINS:', process.env.ALLOWED_DOMAINS);

if (!process.env.ALLOWED_DOMAINS) {
  throw new Error('ALLOWED_DOMAINS environment variable is not defined.');
}

const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');
const allowedIP = process.env.ALLOWED_IP;

app.use((req, res, next) => {
  const clientIP = req.ip;
  console.log("req.ip: ", req.ip)
  if (clientIP === allowedIP) {
    next();
  } else {
    res.status(403).send('Unauthorized');
  }
});

const corsOptions = {
  origin: (origin, callback) => {
    console.log("origin: ", origin)
    if (origin !== undefined || allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      res.status(403).send('Unauthorized');
    }
  },
};



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
