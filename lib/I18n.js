const i18n = require("../i18n/lang_path");

class I18n {
  constructor(lang) {
    this.lang = lang;
  }

  translate(text, lang = this.lang, params = []) {
    let array = text.split(".");
    let value = i18n[lang][array[0]];

    for (let index = 0; index < array.length; index++) {
      value = value[array[i]];
    }

    value = value + "";

    for (let i = 0; i < params.length; i++) {
      value = value.replace("{}", params[i]);
    }

    return value || "";
  }
}

module.exports = I18n;
