const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  services: [
    {
      type: String,
      required: true
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
  address: {
    street: {
      type: String,
      required: true
    },
    number: {
      type: Number
    },
    zip: {
      type: String,
      required: true
    },
    city: {
      type: String
    }
  },
  avatar: {
    type: String,
    unique: true
  },
  images: [{}],

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Professional = mongoose.model(
  "Professional",
  professionalSchema
);
