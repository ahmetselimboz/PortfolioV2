var express = require("express");
var router = express.Router();
const Contact = require("../db/models/Contact");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const _enum = require("../config/enum");
const config = require("../config/environments");
const mail = require("../lib/SendMail");
const I18n = new (require("../lib/I18n"))(config.DEFAULT_LANG);

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
      }).save();

      if (contact) {
       
        await mail("<h4>Name: "+req.body.name+"</h4>"  +"<h4>Email: "+req.body.email+"</h4>"  +  "<u>Message:</u><br/><p>" + req.body.message + "</p>", req.body.email)
        res.json(Response.successResponse(I18n.translate("SUCCESS.MESSAGE_RECIEVED")));
      } else {
        throw new CustomError(
          _enum.HTTP_CODES.BAD_REQUEST,
          i18n.translate("COMMON.BAD_REQUEST")
        );
      }
    }
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(error.statusCode || errorResponse.code).json(Response.errorResponse(error));
  }
});

module.exports = router;
