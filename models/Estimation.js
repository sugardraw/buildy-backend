const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const estimationRequestSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  requestData: {
    title: String,
    description: String,
    budget: String,
    date: String

  },
  sendTo:String,
  editedImages: [{}],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = EstimationRequest = mongoose.model(
  "Estimation",
  estimationRequestSchema
);
