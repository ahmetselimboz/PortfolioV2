var express = require("express");
var router = express.Router();
const HomePage = require("../db/models/HomePage");
const Response = require("../lib/Response");
var isBase64 = require("is-base64");
const I18n = require("../lib/I18n");
const _enum = require("../config/enum");
const { base64ToImage } = require("../lib/Minio");
const logger = require("../lib/logger/LoggerClass");
const auth = require("../middlewares/checkToken");


/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const result = await HomePage.findOne({lang:req.query.lang});
    //console.log(req.user);
    res.json(Response.successResponse(result));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
  }
});

router.all("*", auth, (req, res, next) => {
  next();
});


router.post("/", async (req, res, next) => {
  try {
    if (!req.body) {
      logger.error(req.user?.username, "Homepage", "Update", "req.body doesn't exist!");
      throw new CustomError(
        _enum.HTTP_CODES.BAD_REQUEST,
        i18n.translate("COMMON.BAD_REQUEST")
      );
    } else {
      var options = {
        lang: req.body.lang,
        sideImg: req.body.sideImg,
        profilImg: req.body.profilImg,

        mainText: req.body.mainText,
        card1: {
          title: req.body.card1Title,
          text: req.body.card1Text,
        },
        card2: {
          title: req.body.card2Title,
          text: req.body.card2Text,
        },
        card3: {
          title: req.body.card3Title,
          text: req.body.card3Text,
        },
        card4: {
          title: req.body.card4Title,
          text: req.body.card4Text,
        },
      };

      if (isBase64(req.body.sideImg, { allowMime: true })) {
        const sideImg = await base64ToImage(
          req.body.sideImg,
          "Home_Side_Img.jpeg"
        );

        options.sideImg = sideImg;
      }

      if (isBase64(req.body.profilImg, { allowMime: true })) {
        options.profilImg = await base64ToImage(
          req.body.profilImg,
          "Home_profilImg.jpeg"
        );
      }
  

      const result = await HomePage.findByIdAndUpdate(req.body.id, options, {
        new: true,
      });

      if (result) {
        res.json(Response.successResponse({result}));
      } else {
        logger.error(req.user?.username, "Homepage", "Update", "Update Error!");
        throw new CustomError(
          _enum.HTTP_CODES.BAD_REQUEST,
          I18n.translate("COMMON.BAD_REQUEST")
        );
      }
   
    }
  } catch (error) {
    logger.error(req.user?.username, "Homepage", "Update", error);
    let errorResponse = Response.errorResponse(error);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(Response.errorResponse(error));
  }
});


router.get("/test-token", (req,res, next)=>{
  res.status(200).json({success:true})
})

module.exports = router;
