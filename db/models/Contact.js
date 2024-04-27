const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const buySchema = new Schema({ name: String, url: String, linkPrice: String });
const contactSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

   
  },
  { versionKey: "false", timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
