const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  first_name: {
    type: String,
    required: true,
    unique: true
  },
  last_name: {
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
  avatar: {},
  estimations: [{ type: Schema.Types.ObjectId, ref: "EstimationRequest" }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("User", userSchema);
