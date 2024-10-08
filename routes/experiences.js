var express = require("express");
var router = express.Router();
const Experiences = require("../db/models/Experiences");
const Response = require("../lib/Response");
const _enum = require("../config/enum");
const isBase64 = require("is-base64");
const { base64ToImage, removeObject } = require("../lib/Minio");
const logger = require("../lib/logger/LoggerClass");
const auth = require("../middlewares/checkToken");
const slugify = require("slugify");

router.get("/", async function (req, res, next) {
  try {
    const result = await Experiences.find({lang:req.query.lang});

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

router.post("/add-experience", async (req, res, next) => {
  try {
    if (!req.body) {
      res.redirect("/homepage");
    } else {
      const randomNumber = generateRandomSixDigitNumber()

      const exp = new Experiences();

      exp.name = req.body.name;
      exp.tag = req.body.tag;
      exp.date = req.body.date;
      exp.desc = req.body.desc;
      exp.lang = req.body.lang;
      exp.slug = `${slug(req.body.name)}-${randomNumber}`;;

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

router.get("/delete-experience/:slug", async (req, res, next) => {
  try {
    if (!req.params) {
    } else {
      const result = await Experiences.findOneAndDelete({slug:req.params.slug});

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
        lang: req.body.lang,
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
