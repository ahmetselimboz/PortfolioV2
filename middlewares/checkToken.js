const passport = require("passport");
const _enum = require("../config/enum");

function capitalizeWords(str) {

  let words = str.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  return words.join(" ");
}

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
   
    if (err) {
      return next(err);
    }
    if (!user) {
      let errorResponse = {
        code: _enum.HTTP_CODES.UNAUTHORIZED,
        error: {
          message: capitalizeWords(info.message + "!"),
        },
      };
      return res.status(_enum.HTTP_CODES.UNAUTHORIZED).json(errorResponse);
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;
