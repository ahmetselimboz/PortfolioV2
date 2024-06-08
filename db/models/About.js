const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const buySchema = new Schema({ name: String, url: String, linkPrice: String });
const aboutSchema = new Schema(
  {
    desc1:{
      type:String,
      trim:true
    },
    mainImg:{
      type:String,
      trim:true
    },
    desc2:{
      type:String,
      trim:true
    },
    sideImg1:{
      type:String,
      trim:true
    },
    sideImg2:{
      type:String,
      trim:true
    },
    sideImg3:{
      type:String,
      trim:true
    },
    desc3:{
      type:String,
      trim:true
    },
    lang:{
      type:String,
      required: true
    }
  },
  { versionKey: "false", timestamps: true }
);

const About = mongoose.model("About", aboutSchema);

module.exports = About;
