var express = require('express');
var router = express.Router();
const Work = require("../db/models/Projects")
const Response = require("../lib/Response");
const logger = require("../lib/logger/LoggerClass");
const _enum = require('../config/enum');
const isBase64 = require("is-base64")
const {base64ToImage, removeObject} = require("../lib/Minio")
const auth = require("../middlewares/checkToken");

router.get('/', async function(req, res, next) {
    try {
        const result = await Work.find();
        res.json(Response.successResponse(result));
      } catch (error) {
    
        res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
      }
});

router.get('/:id', async function(req, res, next) {
    try {
        const result = await Work.findById(req.params.id);
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
  
      project.tag = req.body.tag;
      project.name = req.body.name;
      project.text = req.body.text;
      project.date = req.body.date;
      project.lang = req.body.lang;
      project.link = req.body.link;
      project.desc = req.body.desc;
  
      project.save();

      res.json(Response.successResponse({success:true}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Works", "Add", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
  }
})


router.get("/delete-work/:id", async (req,res,next)=>{
  try {
    if (!req.params) {
    } else {
      const result = await Work.findByIdAndDelete(req.params.id);
      
      removeObject("Work_"+result?.name+".jpeg");

      res.json(Response.successResponse({success:true}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Works", "Delete", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
 
  }
})


router.post("/update-work/:id", async (req,res,next)=>{
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
        lang: req.body.lang,
        link: req.body.link,
        desc: req.body.desc,
      };
  
      if (isBase64(req.body.mainImg, { allowMime: true })) {
        options.mainImg = await base64ToImage(
          req.body.mainImg,
          "Work_" + req.body.name + ".jpeg"
        );
      }
  
      const data = await Work.findByIdAndUpdate(req.body.id, options, {new:true});
      res.json(Response.successResponse({data:data}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Works", "Update", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
 
  }
})

module.exports = router;
