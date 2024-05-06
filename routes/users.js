var express = require("express");
const Users = require("../db/models/Users");
const _enum = require("../config/enum");
const bcrypt = require("bcryptjs");
const Response = require("../lib/Response");

var router = express.Router();

router.post("/register", async function (req, res, next) {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    let user = await Users.findOne({username:username});

    if (user) {
      return res.sendStatus(_enum.HTTP_CODES.NOT_ACCEPTABLE);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createdUser = await Users({
      username: username,
      password: hashPassword,
    }).save();

    res
      .status(_enum.HTTP_CODES.CREATED)
      .json(Response.successResponse({ success: true, createdUser }));
  } catch (error) {}
});

module.exports = router;
