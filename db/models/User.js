const mongoose = require("mongoose");
const config = require("../../config/environments")

const schema = mongoose.Schema(
  {
    email: String,
    password: String,
    language: { type: String, default: config.DEFAULT_LANG },
  },
  { versionKey: false, timestamps: true }
);

class User extends mongoose.Model {}

schema.loadClass(User);

module.exports = mongoose.model("User", schema);
