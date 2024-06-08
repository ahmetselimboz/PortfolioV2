const mongoose = require("mongoose");
const dataURI = require("../../lib/defaultImage");
const Schema = mongoose.Schema;
const expSchema = new Schema(
  {
    tag: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },

    date: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    mainImg: {
      type: String,
      trim: true,
      default: dataURI
    },
    lang:{
      type:String,
      required: true
    },
    slug:{
      type:String,
      required: true
    }

    
  },
  { versionKey: "false", timestamps: true }
);

const Exp = mongoose.model("Experience", expSchema);

module.exports = Exp;
