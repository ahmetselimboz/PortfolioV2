var express = require("express");
var router = express.Router();
const Experiences = require("../db/models/Experiences");
const Response = require("../lib/Response");
const _enum = require("../config/enum");
const isBase64 = require("is-base64");
const { base64ToImage, removeObject } = require("../lib/Minio");
const logger = require("../lib/logger/LoggerClass");

router.get("/", async function (req, res, next) {
  try {
    const result = await Experiences.find();

    res.json(Response.successResponse(result));
  } catch (error) {
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.post("/add-experience", async (req, res, next) => {
  try {
    if (!req.body) {
      res.redirect("/homepage");
    } else {
      const exp = new Experiences();

      exp.name = req.body.name;
      exp.tag = req.body.tag;
      exp.date = req.body.date;
      exp.desc = req.body.desc;

      if (isBase64(req.body.mainImg, { allowMime: true })) {
        exp.mainImg = await base64ToImage(
          req.body.mainImg,
          "Exp_" + req.body.name + ".jpeg"
        );
      }

      exp.save();
      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Experiences", "Add", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.get("/delete-experience/:id", async (req, res, next) => {
  try {
    if (!req.params) {
    } else {
      const result = await Experiences.findByIdAndDelete(req.params.id);

      removeObject("Exp_" + result?.name + ".jpeg");

      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Experiences", "Delete", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.post("/update-experience/:id", async (req,res,next)=>{
  try {
    if (!req.body) {
      logger.error(req.user?.username, "Experiences", "Update", "req.body doesn't exist!");
      throw new CustomError(
        _enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.BAD_REQUEST")
      );
    } else {
      var options = {
        name: req.body.name,
        tag: req.body.tag,
        date: req.body.date,
        desc: req.body.desc,
        mainImg: req.body.mainImg,
      };
      
      if (isBase64(req.body.mainImg, { allowMime: true })) {
        options.mainImg = await base64ToImage(
          req.body.mainImg,
          "Exp_" + req.body.name + ".jpeg"
        );
      }
  
  
      const data = await Experiences.findByIdAndUpdate(req.body.id, options);
      res.json(Response.successResponse({data:data}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Works", "Update", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
 
  }
})


module.exports = router;
