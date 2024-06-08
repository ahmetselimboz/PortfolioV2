const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const buySchema = new Schema({ name: String, url: String, linkPrice: String });
const footerSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },

    TwitterUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    mail: {
      type: String,
      trim: true,
    },
    lang:{
      type:String,
      required: true
    }


   
  },
  { versionKey: "false", timestamps: true }
);

const Footer = mongoose.model("Footer", footerSchema);

module.exports = Footer;
