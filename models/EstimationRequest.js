const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const estimationRequestSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  images: [{}],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = EstimationRequest = mongoose.model(
  "EstimationRequest",
  estimationRequestSchema
);