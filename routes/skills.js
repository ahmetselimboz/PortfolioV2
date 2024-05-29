var express = require('express');
var router = express.Router();
const Skills = require("../db/models/Skills")
const Response = require("../lib/Response");

router.get('/', async function(req, res, next) {
    try {
        const result = await Skills.find();
        res.json(Response.successResponse(result));
      } catch (error) {
      
        res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
      }
});

router.post("/add-skill", async (req,res,next)=>{
  try {
  
    if (!req.body) {
      logger.error(req.user?.username, "Skills", "Add", "req.body doesn't exist!");
      throw new CustomError(
        _enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.BAD_REQUEST")
      );
    } else {

      const skill = new Skills();

      skill.name = req.body.name;
      skill.percent = req.body.percent;
      skill.save();

      res.json(Response.successResponse({success:true}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Skills", "Add", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
  }
})


router.get("/delete-skill/:id", async (req,res,next)=>{
  try {
    if (!req.params) {
    } else {
     await Skills.findByIdAndDelete(req.params.id);
      res.json(Response.successResponse({success:true}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Skills", "Delete", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
 
  }
})

router.post("/update-skill/:id", async (req,res,next)=>{
  try {
    if (!req.body) {
      logger.error(req.user?.username, "Skills", "Update", "req.body doesn't exist!");
      throw new CustomError(
        _enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.BAD_REQUEST")
      );
    } else {
      var options = {
        name: req.body.name,
        percent: req.body.percent,
      };
  
      await Skills.findByIdAndUpdate(req.body.id, options);
      res.json(Response.successResponse({success:true}));
    }
  } catch (error) {
    logger.error(req.user?.username, "Skills", "Update", error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
 
  }
})

module.exports = router;