const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const env = require("../config/environments");
const Users = require("../db/models/Users");

module.exports = () => {
  let strategy = new Strategy(
    {
      secretOrKey: env.JWT.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const user = await Users.findOne({ id: payload.id });

        if (user) {
          done(null, {
            id: user.id,
            username: user.username,
            language: user.language,
            exp: parseInt(Date.now() / 1000) * env.JWT.EXPIRE_TIME,
          });
        } else {
          done(new Error("User not found!"), null);
        }
      } catch (error) {
        done(error, null);
      }
    }
  );

  passport.use(strategy);

  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: () => {
      return passport.authenticate("jwt", { session: false });
    },
  };
};
