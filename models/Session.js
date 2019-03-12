const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  token: {
    type: String
  },
  userId: {
    type: String
  }
});

module.exports = Session = mongoose.model("Session", SessionSchema);
