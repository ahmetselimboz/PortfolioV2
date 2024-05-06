const mongoose = require("mongoose");
const config = require("../../config/environments")

const schema = mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { versionKey: false, timestamps: true }
);

class User extends mongoose.Model {}

schema.loadClass(User);

const Users = mongoose.model("Users", schema);

module.exports = Users;
