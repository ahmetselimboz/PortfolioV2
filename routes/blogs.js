var express = require('express');
var router = express.Router();
const Blogs = require("../db/models/Blogs")
const Response = require("../lib/Response");

router.get('/', async function(req, res, next) {
    try {
        const result = await Blogs.find();
        res.json(Response.successResponse(result));
      } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(Response.errorResponse(error));
      }
});

router.get('/:id', async function(req, res, next) {
    try {
        const result = await Blogs.findById(req.params.id)
        res.json(Response.successResponse(result));
      } catch (error) {
        let errorResponse = Response.errorResponse(error);
        res.status(errorResponse.code).json(Response.errorResponse(error));
      }
});

module.exports = router;