const mongoose = require("mongoose");
const dataURI = require("../../lib/defaultImage");
const Schema = mongoose.Schema;
// const buySchema = new Schema({ name: String, url: String, linkPrice: String });
const blogSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    desc: {
      type: String,
      trim: true,
      required: true,
    },
    click: {
      type: Number,
      trim: true,
      default: 0,
    },
    tags: [
      {
        tagName: {
          type: String,
          trim: true,
        },
      },
    ],
    mainImg:{
      type: String,
      trim: true,
      default: dataURI
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { versionKey: "false", timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
