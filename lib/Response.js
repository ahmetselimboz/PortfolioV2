const _enum = require("../config/enum");
const CustomError = require("./Error");
const config = require("../config/environments");
const i18n = new (require("./I18n"))(config.DEFAULT_LANG);

class Response {
  static successResponse(data) {
    return {
      code: 200,
      data,
    };
  }

  static errorResponse(error) {
    if (error instanceof CustomError) {
      return {
        code: error.code,
        error: {
          message: error.message,
          description: error.description,
        },
      };
    }

    // return {
    //   code: _enum.HTTP_CODES.INT_SERVER_ERROR,
    //   error: {
    //     message: i18n.translate("COMMON.UNKNOWN_ERROR", lang),
    //     description: error.message,
    //   },
    // };
  }
}

module.exports = Response;
