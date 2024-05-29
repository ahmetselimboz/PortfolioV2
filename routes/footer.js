var express = require("express");
var router = express.Router();
const Footer = require("../db/models/Footer");
const Response = require("../lib/Response");
const auth = require("../middlewares/checkToken");
const logger = require("../lib/logger/LoggerClass");
const _enum = require("../config/enum");

router.get("/", async function (req, res, next) {
  try {
    const result = await Footer.findOne();
    res.json(Response.successResponse(result));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(Response.errorResponse(error));
  }
});

router.all("*", auth, (req, res, next) => {
  next();
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.body) {
      logger.error(
        req.user?.username,
        "Footer",
        "Update",
        "req.body doesn't exist!"
      );
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "req.body doesn't exist!" });
    } else {
      await Footer.findByIdAndUpdate(req.body.id, {
        title: req.body.title,
        instagramUrl: req.body.instagramUrl,
        TwitterUrl: req.body.TwitterUrl,
        linkedinUrl: req.body.linkedinUrl,
        mail: req.body.mail,
      });
      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Footer", "Update", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

module.exports = router;
