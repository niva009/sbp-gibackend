const mongoose = require("mongoose");
const { Schema } = mongoose;

const BreakfastSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  registrationId: {
    type: String,
    required: false,
    unique: true,
  },
  legend: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("BreakfastSchema", BreakfastSchema);
