var express = require("express");
const Users = require("../db/models/Users");
const _enum = require("../config/enum");
const bcrypt = require("bcryptjs");
const Response = require("../lib/Response");
const config = require("../config/environments");
const jwt = require("jwt-simple");

var router = express.Router();

router.post("/register", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    let user = await Users.findOne({ username: username });

    if (user) {
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "Already this user exist!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await Users({
      username: username,
      password: hashPassword,
    }).save();

    res
      .status(_enum.HTTP_CODES.CREATED)
      .json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(errorResponse);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;
    const user = await Users.findOne({ username });

    if (!user) {
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "User doesn't exist!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res
        .status(_enum.HTTP_CODES.NOT_ACCEPTABLE)
        .json({ success: false, error: "Username or password is wrong!" });
    }

    let payload = {
      id: user._id,
      
      exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME,
    };

    let token = jwt.encode(payload, config.JWT.SECRET);

    let userData = {
      username,
    };

    res.json(Response.successResponse({ token, user: userData }));
  } catch (error) {
    
    res.status(_enum.HTTP_CODES.INT_SERVER_ERROR).json(errorResponse);
  }
});

module.exports = router;
