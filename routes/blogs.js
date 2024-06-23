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
const Subs = require("../db/models/Subscribers");
const mail = require("../lib/SendMail");

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
      show: true,
    });

    const regex = new RegExp(req.params.slug + "$");
    var data = await Blogs.find({
      slug: { $not: regex },
      lang: req.query.lang,
      show: true,
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
    } 

    const blog = new Blogs();
    console.log(req.body);
    
    if (isBase64(req.body.mainImg, { allowMime: true })) {
      console.log("Merhaba");
      blog.mainImg = await base64ToImage(
        req.body.mainImg,
        "Blog_" + req.body.title.substring(0, 8) + ".jpeg"
      );
    } else {
      blog.mainImg = req.body.mainImg;
    }
    
    const randomNumber = generateRandomSixDigitNumber();
    blog.title = req.body.title;
    blog.desc = req.body.desc;
    blog.content = req.body.content;
    blog.lang = req.body.lang;
    blog.slug = `${slug(req.body.title)}-${randomNumber}`;
    blog.tags = req.body.tags.map((tag) => ({ tagName: tag }));
    blog.show = false;
    
    // İlk blog'u kaydet
    await blog.save();

    // İkinci blog'u oluştur ve kaydet
    const translatedBlog = new Blogs();
    translatedBlog.mainImg = blog.mainImg;
    translatedBlog.title = "example";
    translatedBlog.desc = "example";
    translatedBlog.content = "example";
    translatedBlog.lang = req.body.lang === "TR" ? "EN" : "TR";
    translatedBlog.slug = `${slug("example")}-${randomNumber}`;
    translatedBlog.tags = req.body.tags.map((tag) => ({ tagName: tag }));
    translatedBlog.show = false;
    
    await translatedBlog.save();

    res.json(Response.successResponse({ success: true }));
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
        slug: {
          $regex: `${getLastSixCharacters(req.params.slug)}$`,
          $options: "i",
        },
      });
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

router.post("/show", async (req, res, next) => {
  try {
    await Blogs.updateMany(
      { slug: { $regex: `${req.body.slug}$`, $options: "i" } },
      { show: !req.body.show }
    );

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    logger.error(req.user?.username, "Blogs", "Show", error);
    res
      .status(_enum.HTTP_CODES.INT_SERVER_ERROR)
      .json(Response.errorResponse(error));
  }
});

router.post("/notify", async (req, res, next) => {
  try {
    const subs = await Subs.find({});
    let emailArray = [];
    for (let index = 0; index < subs.length; index++) {
      emailArray.push(subs[index].email);
    }

    await mail(req.body.msg, emailArray);
    res.json(Response.successResponse({ success: true }));
  } catch (error) {}
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
