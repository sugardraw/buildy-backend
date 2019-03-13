const mongoose = require("mongoose");

const User = require("../models/User");
const EstimationRequest = require("../models/EstimationRequest");

const estimationController = {};

estimationController.saveNewEstimation = (req, res) => {
  if (req.body !== null || req.body !== undefined) {
    User.findOne(
      {
        _id: "5c89412b1ed3611c98fbb000"
      },
      function(err, user) {
        const estimationRequest = new EstimationRequest({
          user: user._id,
          ...req.body
        });

        estimationRequest.save(function(err) {
          if (err) return handleError(err);
          return res.send({
            success: true,
            msg: "estimation was saved:)!"
          });
        });
      }
    );
  }
};

module.exports = estimationController;
