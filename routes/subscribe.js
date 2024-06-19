const express = require("express");
const router = express.Router();
const Subs = require("../db/models/Subscribers");
const Response = require("../lib/Response");
const logger = require("../lib/logger/LoggerClass");
const auth = require("../middlewares/checkToken");
const _enum = require("../config/enum");



router.post("/", async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false });

    const findSubs = await Subs.findOne({ email: req.body.email });

    if (findSubs)
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "Already subscribe" });

    const subs = new Subs();
    subs.email = req.body.email;
    subs.lang = req.body.lang;
    subs.save();
    console.log(subs);
    
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    logger.error(req.user?.username, "Subscribe", "Add", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

module.exports = router;
