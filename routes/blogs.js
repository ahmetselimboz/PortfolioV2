var express = require("express");
var router = express.Router();
const Blogs = require("../db/models/Blogs");
const Response = require("../lib/Response");
const _enum = require("../config/enum");
const isBase64 = require("is-base64");
const { base64ToImage, removeObject } = require("../lib/Minio");
const logger = require("../lib/logger/LoggerClass");
const auth = require("../middlewares/checkToken");

router.get("/", async function (req, res, next) {
  try {
    const result = await Blogs.find();
    res.json(Response.successResponse(result));
  } catch (error) {
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const result = await Blogs.findById(req.params.id);

    var data = await Blogs.find({ _id: { $ne: req.params.id } })
      .limit(6)
      .select("mainImg tags title desc");

    res.json(Response.successResponse({ result, data }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(error.statusCode).json(Response.errorResponse(error));
  }
});

router.all("*", auth, (req, res, next) => {
  next();
});

router.post("/add-blog", async (req, res, next) => {
  try {
    if (!req.body) {
      logger.error(
        req.user?.username,
        "Blog",
        "Add",
        "req.body doesn't exist!"
      );
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "req.body doesn't exist!" });
    } else {
      const blog = new Blogs();

      if (isBase64(req.body.mainImg, { allowMime: true })) {
        blog.mainImg = await base64ToImage(
          req.body.mainImg,
          "Blog_" + req.body.title.substring(0, 8) + ".jpeg"
        );
      }

      blog.mainImg = req.body.mainImg;
      blog.title = req.body.title;
      blog.desc = req.body.desc;
      blog.content = req.body.content;
      blog.tags = req.body.tags.map((tag) => ({ tagName: tag }));
      blog.save();
      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    console.log(error);
    logger.error(req.user?.username, "Blog", "Add", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.get("/delete-blog/:id", async (req, res, next) => {
  try {
    if (!req.params) {
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "req.params doesn't exist!" });
    } else {
      const result = await Blogs.findByIdAndDelete(req.params.id);
      removeObject("Ref_" + result.name + ".jpeg");

      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Blog", "Delete", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.post("/update-blog/:id", async (req, res, next) => {
  try {
    if (!req.body) {
      logger.error(
        req.user?.username,
        "Blog",
        "Update",
        "req.body doesn't exist!"
      );
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "req.body doesn't exist!" });
    } else {
      console.log(req.body.tags);
      var options = {
        mainImg: req.body.mainImg,
        content: req.body.content,
        title: req.body.title,
        desc: req.body.desc,
        tags: req.body.tags.map((tag) => ({ tagName: tag })),
      };
      console.log(options.tags);
      if (isBase64(req.body.mainImg, { allowMime: true })) {
        options.mainImg = await base64ToImage(
          req.body.mainImg,
          "Blog_" + req.body.title.substring(0, 8) + ".jpeg"
        );
      }

      await Blogs.findByIdAndUpdate(req.body.id, options);
      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Blogs", "Update", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

module.exports = router;
