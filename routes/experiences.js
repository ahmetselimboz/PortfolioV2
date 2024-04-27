var express = require('express');
var router = express.Router();
const Experiences = require("../db/models/Experiences")
const Response = require("../lib/Response");

router.get('/', async function(req, res, next) {
    try {
        const result = await Experiences.find();
        res.json(Response.successResponse(result));
      } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(Response.errorResponse(error));
      }
});

module.exports = router;