const mongoose = require("mongoose");

const adminImgSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = AdminImg = mongoose.model("AdminImg", adminImgSchema);
