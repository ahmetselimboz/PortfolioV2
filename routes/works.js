var express = require('express');
var router = express.Router();
const Work = require("../db/models/Projects")
const Response = require("../lib/Response");
const logger = require("../lib/logger/LoggerClass");
const _enum = require('../config/enum');
const isBase64 = require("is-base64")
const {base64ToImage, removeObject} = require("../lib/Minio")
const auth = require("../middlewares/checkToken");
const slugify = require("slugify");

router.get('/', async function(req, res, next) {
    try {
        const result = await Work.find({lang:req.query.lang});
        res.json(Response.successResponse(result));
      } catch (error) {
    
        res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
      }
});

router.get('/:slug', async function(req, res, next) {
    try {
        const result = await Work.findOne({
          slug: { $regex: `${req.params.slug}$`, $options: "i" },
          lang: req.query.lang,
        });
        res.json(Response.successResponse(result));
      } catch (error) {
       
        res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
      }
});

router.all("*", auth, (req, res, next) => {
  next();
});

router.post("/add-work", async (req,res,next)=>{
  try {
  
    if (!req.body) {
      logger.error(req.user?.username, "Works", "Add", "req.body doesn't exist!");
      throw new CustomError(
        _enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.BAD_REQUEST")
      );
    } else {
      const project = new Work();
  
      if (isBase64(req.body.mainImg, { allowMime: true })) {
        project.mainImg = await base64ToImage(
          req.body.mainImg,
          "Work_" + req.body.name + ".jpeg"
        );
      }
      const randomNumber = generateRandomSixDigitNumber();
  
      project.tag = req.body.tag;
      project.name = req.body.name;
      project.text = req.body.text;
      project.date = req.body.date;
      project.tech = req.body.tech;
      project.link = req.body.link;
      project.desc = req.body.desc;
      project.lang = req.body.lang;
      project.slug = `${slug(req.body.name)}-${randomNumber}`;
  
      project.save();

      const projects = new Work();
      projects.mainImg =  project.mainImg
      projects.tag = req.body.tag;
      projects.name = "example";
      projects.text = "example";
      projects.date = "example";
      projects.tech = "example";
      projects.link = "example.com";
      projects.desc = "example";
      projects.lang = req.body.lang == "TR" ? "EN" : "TR";
      projects.slug = `${slug("example")}-${randomNumber}`;
  
      await projects.save();

      res.json(Response.successResponse({success:true}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Works", "Add", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
  }
})


router.get("/delete-work/:slug", async (req,res,next)=>{
  try {
    if (!req.params) {
    } else {
      const result = await Work.deleteMany({
        slug: { $regex: `${getLastSixCharacters(req.params.slug)}$`, $options: "i" }});
      
      removeObject("Work_"+result?.name+".jpeg");

      res.json(Response.successResponse({success:true}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Works", "Delete", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
 
  }
})


router.post("/update-work/:slug", async (req,res,next)=>{
  try {
    if (!req.body) {
      logger.error(req.user?.username, "Works", "Update", "req.body doesn't exist!");
      throw new CustomError(
        _enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.BAD_REQUEST")
      );
    } else {
      var options = {
        mainImg: req.body.mainImg,
        tag: req.body.tag,
        name: req.body.name,
        text: req.body.text,
        date: req.body.date,
        tech: req.body.tech,
        link: req.body.link,
        desc: req.body.desc,
        lang: req.body.lang,
        slug: `${slug(req.body.name)}-${getLastSixCharacters(
          req.params.slug
        )}`,
      };
  
      if (isBase64(req.body.mainImg, { allowMime: true })) {
        options.mainImg = await base64ToImage(
          req.body.mainImg,
          "Work_" + req.body.name + ".jpeg"
        );
      }
  
      const data = await Work.findOneAndUpdate({ slug: req.params.slug }, options, {new:true});
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
