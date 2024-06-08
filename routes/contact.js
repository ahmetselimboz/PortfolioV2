var express = require("express");
var router = express.Router();
const Contact = require("../db/models/Contact");
const Response = require("../lib/Response");
const logger = require("../lib/logger/LoggerClass");
const CustomError = require("../lib/Error");
const _enum = require("../config/enum");
const config = require("../config/environments");
const mail = require("../lib/SendMail");
const I18n = new (require("../lib/I18n"))(config.DEFAULT_LANG);
const auth = require("../middlewares/checkToken");

router.post("/", async function (req, res, next) {
  try {
    if (
      req.body.name == undefined ||
      req.body.email == undefined ||
      req.body.message == undefined
    ) {
      throw new CustomError(
        _enum.HTTP_CODES.BAD_REQUEST,
        I18n.translate("COMMON.UNKNOWN_ERROR")
      );
    } else {
      const contact = await new Contact({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        lang:req.body.lang
      }).save();
   
      if (contact) {
        await mail(
          "<h4>Name: " +
            req.body.name +
            "</h4>" +
            "<h4>Email: " +
            req.body.email +
            "</h4>" +
            "<u>Message:</u><br/><p>" +
            req.body.message +
            "</p>",
          req.body.email
        );
        res.json(
          Response.successResponse(I18n.translate("SUCCESS.MESSAGE_RECIEVED"))
        );
      } else {
        throw new CustomError(
          _enum.HTTP_CODES.BAD_REQUEST,
          i18n.translate("COMMON.BAD_REQUEST")
        );
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.all("*", auth, (req, res, next) => {
  next();
});

router.get("/", async function (req, res, next) {
  try {
    const result = await Contact.find();

    res.json(Response.successResponse(result));
  } catch (error) {
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.get("/delete-contact/:id", async (req, res, next) => {
  try {
    if (!req.params) {
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "req.params doesn't exist!" });
    } else {
      const result = await Contact.findByIdAndDelete(req.params.id);

      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Contact", "Delete", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

module.exports = router;
