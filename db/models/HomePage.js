const mongoose = require("mongoose");
const dataURI = require("../../lib/defaultImage");
const Schema = mongoose.Schema;

const homeSchema = new Schema(
  {
    
    profilImg: {
      type: String,
      trim: true,
      default: dataURI
    },
    sideImg: {
      type: String,
      trim: true,
      default: dataURI
    },

    mainText: {
      type: String,
      trim: true,
    },
    card1: {
      title: {
        type: String,
        trim: true,
      },
      text: {
        type: String,
        trim: true,
      },
    },
    card2: {
      title: {
        type: String,
        trim: true,
      },
      text: {
        type: String,
        trim: true,
      },
    },
    card3: {
      title: {
        type: String,
        trim: true,
      },
      text: {
        type: String,
        trim: true,
      },
    },
    card4: {
      title: {
        type: String,
        trim: true,
      },
      text: {
        type: String,
        trim: true,
      },
    }
  },
  { versionKey: "false", timestamps: true }
);

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
