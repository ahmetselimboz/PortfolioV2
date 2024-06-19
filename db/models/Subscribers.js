const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subsSchema = new Schema(
  {

    email: {
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

const Subs = mongoose.model("Subscriber", subsSchema);

module.exports = Subs;
