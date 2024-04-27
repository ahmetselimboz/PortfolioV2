var express = require("express");
var router = express.Router();
const HomePage = require("../db/models/HomePage");
const Response = require("../lib/Response");


/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const result = await HomePage.findOne();
    res.json(Response.successResponse(result));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(Response.errorResponse(error));
  }
});

module.exports = router;
