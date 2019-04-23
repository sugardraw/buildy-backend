const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  services: [
    {
      type: String
    }
  ],
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  shortDescription: {
    type: String
  },
  longDescription: {
    type: String
  },

  street: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  city: {
    type: String
  },

  avatar: {},
  projectImages: [{}],

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Professional = mongoose.model(
  "Professional",
  professionalSchema
);
