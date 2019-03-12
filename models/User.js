const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    unique: true
  },
  images: [{ name: String, tags: String, description: String }],

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("User", userSchema);
