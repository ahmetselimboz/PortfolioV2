var express = require("express");
var router = express.Router();
const About = require("../db/models/About");
const Response = require("../lib/Response");
const logger = require("../lib/logger/LoggerClass");
const _enum = require("../config/enum");
const isBase64 = require("is-base64");
const { base64ToImage, removeObject } = require("../lib/Minio");

router.get("/", async function (req, res, next) {
  try {
    const result = await About.findOne();
    res.json(Response.successResponse(result));
  } catch (error) {
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.body) {
      logger.error(
        req.user?.username,
        "About",
        "Update",
        "req.body doesn't exist!"
      );
      return res
      .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
      .json({ success: false, error: "req.body doesn't exist!" });
    } else {
      var options = {
        desc1: req.body.desc1,
        desc2: req.body.desc2,
        desc3: req.body.desc3,
        mainImg: req.body.mainImg,
        sideImg1: req.body.sideImg1,
        sideImg2: req.body.sideImg2,
        sideImg3: req.body.sideImg3,
      };

      if (isBase64(req.body.mainImg, { allowMime: true })) {
        options.mainImg = await base64ToImage(
          req.body.mainImg,
          "About_MainImg.jpeg"
        );
      }

      if (isBase64(req.body.sideImg1, { allowMime: true })) {
        options.sideImg1 = await base64ToImage(
          req.body.sideImg1,
          "About_sideImg1.jpeg"
        );
      }
      if (isBase64(req.body.sideImg2, { allowMime: true })) {
        options.sideImg2 = await base64ToImage(
          req.body.sideImg2,
          "About_sideImg2.jpeg"
        );
      }
      if (isBase64(req.body.sideImg3, { allowMime: true })) {
        options.sideImg3 = await base64ToImage(
          req.body.sideImg3,
          "About_sideImg3.jpeg"
        );
      }

      await About.findByIdAndUpdate(req.body.id, options);
      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "About", "Update", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

module.exports = router;
