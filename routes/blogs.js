var express = require("express");
var router = express.Router();
const Blogs = require("../db/models/Blogs");
const Response = require("../lib/Response");
const _enum = require("../config/enum");
const isBase64 = require("is-base64");
const { base64ToImage, removeObject } = require("../lib/Minio");
const logger = require("../lib/logger/LoggerClass");
const auth = require("../middlewares/checkToken");
const slugify = require("slugify");

router.get("/", async function (req, res, next) {
  try {
    const result = await Blogs.find({ lang: req.query.lang });
    res.json(Response.successResponse(result));
  } catch (error) {
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.get("/:slug", async function (req, res, next) {
  try {
    const result = await Blogs.findOne({
      slug: { $regex: `${req.params.slug}$`, $options: "i" },
      lang: req.query.lang,
    });

    const regex = new RegExp(req.params.slug + "$");
    var data = await Blogs.find({
      slug: { $not: regex },
      lang: req.query.lang,
    })
      .limit(6)
      .select("mainImg tags title desc slug lang");

    res.json(Response.successResponse({ result, data }));
  } catch (error) {
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
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
      const randomNumber = generateRandomSixDigitNumber();

      blog.mainImg = req.body.mainImg;
      blog.title = req.body.title;
      blog.desc = req.body.desc;
      blog.content = req.body.content;
      blog.lang = req.body.lang;
      blog.slug = `${slug(req.body.title)}-${randomNumber}`;
      blog.tags = req.body.tags.map((tag) => ({ tagName: tag }));
      blog.save();

      const blogs = new Blogs();
      blogs.mainImg = blog.mainImg;
      blogs.title = "example";
      blogs.desc = "example";
      blogs.content = "example";
      blogs.lang = req.body.lang == "TR" ? "EN" : "TR";
      blogs.slug = `${slug("example")}-${randomNumber}`;
      blogs.tags = req.body.tags.map((tag) => ({ tagName: tag }));
      await blogs.save();

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

router.get("/delete-blog/:slug", async (req, res, next) => {
  try {
    if (!req.params) {
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "req.params doesn't exist!" });
    } else {
      const result = await Blogs.deleteMany({
        slug: { $regex: `${getLastSixCharacters(req.params.slug)}$`, $options: "i" }});
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

router.post("/update-blog/:slug", async (req, res, next) => {
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
      var options = {
        mainImg: req.body.mainImg,
        content: req.body.content,
        title: req.body.title,
        desc: req.body.desc,
        lang: req.body.lang,
        slug: `${slug(req.body.title)}-${getLastSixCharacters(
          req.params.slug
        )}`,
        tags: req.body.tags.map((tag) => ({ tagName: tag })),
      };

      if (isBase64(req.body.mainImg, { allowMime: true })) {
        options.mainImg = await base64ToImage(
          req.body.mainImg,
          "Blog_" + req.body.title.substring(0, 8) + ".jpeg"
        );
      }

      await Blogs.findOneAndUpdate({ slug: req.params.slug }, options);
      res.json(Response.successResponse({ success: true }));
    }
  } catch (error) {
    logger.error(req.user?.username, "Blogs", "Update", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

const slug = (title) => {
  const slugOptions = {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    trim: true,
  };

  return slugify(title, slugOptions);
};

function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

function getLastSixCharacters(str) {
  return str.slice(-6);
}

module.exports = router;
