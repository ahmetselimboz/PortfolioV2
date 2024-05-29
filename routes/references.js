var express = require("express");
var router = express.Router();
const References = require("../db/models/References");
const Response = require("../lib/Response");
const logger = require("../lib/logger/LoggerClass");
const _enum = require("../config/enum");
const isBase64 = require("is-base64");
const { base64ToImage, removeObject } = require("../lib/Minio");
const auth = require("../middlewares/checkToken");

router.get("/", async function (req, res, next) {
  try {
    const result = await References.find();
    res.json(Response.successResponse(result));
  } catch (error) {
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.all("*", auth, (req, res, next) => {
  next();
});

router.post("/add-reference", async (req, res, next) => {
  try {
    if (!req.body) {
      logger.error(
        req.user?.username,
        "Reference",
        "Add",
        "req.body doesn't exist!"
      );
      return res
      .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
      .json({ success: false, error: "req.body doesn't exist!" });
    } else {
      const ref = new References();

      if (isBase64(req.body.mainImg, { allowMime: true })) {
        ref.mainImg = await base64ToImage(
          req.body.mainImg,
          "Ref_" + req.body.name + ".jpeg"
        );
      }

      ref.mainImg = req.body.mainImg;
      ref.name = req.body.name;
      ref.title = req.body.title;
      ref.text = req.body.text;

      ref.save();

      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Reference", "Add", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.get("/delete-reference/:id", async (req, res, next) => {
  try {
    if (!req.params) {

      return res
      .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
      .json({ success: false, error: "req.params doesn't exist!" });
    } else {
      const result = await References.findByIdAndDelete(req.params.id);
      removeObject("Ref_" + result.name + ".jpeg");

      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Reference", "Delete", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.post("/update-reference/:id", async (req, res, next) => {
  try {
    if (!req.body) {
      logger.error(
        req.user?.username,
        "References",
        "Update",
        "req.body doesn't exist!"
      );
      return res
      .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
      .json({ success: false, error: "req.body doesn't exist!" });
    } else {
      var options = {
        mainImg: req.body.mainImg,
        name: req.body.name,
        title: req.body.title,
        text: req.body.text,
      };

      if (isBase64(req.body.mainImg, { allowMime: true })) {
        options.mainImg = await base64ToImage(
          req.body.mainImg,
          "Ref_" + req.body.name + ".jpeg"
        );
      }

      await References.findByIdAndUpdate(req.body.id, options);
      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "References", "Update", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

module.exports = router;
