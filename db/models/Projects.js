const mongoose = require("mongoose");
const dataURI = require("../../lib/defaultImage");
const Schema = mongoose.Schema;
const projectSchema = new Schema(
  {
    mainImg: {
      type: String,
      trim: true,
      default: dataURI
    },
    tag: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },

    text: {
      type: String,
      trim: true,
    },

    date: {
      type: String,
      trim: true,
    },

    tech: {
      type: String,
      trim: true,
    },

    link: {
      type: String,
      trim: true,
    },

    desc: {
      type: String,
      trim: true,
    },
    lang:{
      type:String,
      required: true
    },
    slug:{
      type:String,
      required: true
    },
  },
  { versionKey: "false", timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
