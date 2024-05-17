//const passport = require("passport");
//const { ExtractJwt, Strategy } = require("passport-jwt");
const Users = require("../db/models/Users");
const config = require("../config/environments");

const { Strategy, ExtractJwt } = require("passport-jwt");
const jwtOptions = {
  secretOrKey: config.JWT.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = async (payload, done) => {
      try {
        let user = await Users.findOne({ _id: payload.id });

        if (user) {
          done(null, {
            id: user._id,
            username: user.username,
            exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME,
          });
        } else {
          done(new Error("User not found"), null);
        }
      } catch (err) {
        done(err, null);
      }
};
const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
module.exports = {
  jwtStrategy,
};


