const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const buySchema = new Schema({ name: String, url: String, linkPrice: String });
const skillsSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    percent: {
      type: String,
      trim: true,
    },
  },
  { versionKey: "false", timestamps: true }
);

const Skills = mongoose.model("Skills", skillsSchema);

module.exports = Skills;
