const mongoose = require("mongoose");
const fs = require("fs");

const User = require("../models/User");
const Estimation = require("../models/Estimation");

const estimationController = {};

estimationController.saveNewEstimation = (req, res) => {
  console.log(req.body._parts);

  if (req.body !== null || req.body !== undefined) {
    Estimation.findOne({
      user: req.body._parts[0][1].user,
      "requestData.title": req.body._parts[0][1].requestData.requestData.title
    }).exec((err, estimation) => {
      if (err) {
        console.log(err);
        return;
      } else if (!estimation) {
        console.log("No estimations found with this title and description!");

        let estimation = new Estimation({
          user: req.body._parts[0][1].user,
          editedImages: [req.body._parts[0][1].editedImages],
          requestData: {
            ...req.body._parts[0][1].requestData.requestData
          }
        });
        estimation.save(function(err) {
          if (err) {
            return handleError(err);
          } else {
            console.log("estimation successfully saved!");
            return res.status(200).send({
              success: true,
              msg: "estimation was saved:)!"
            });
          }
        });
      } else {
        estimation.editedImages.push(req.body._parts[0][1].editedImages);

        estimation.save(function(err) {
          if (err) {
            return handleError(err);
          } else {
            console.log(
              `estimation with the title ${
                estimation.requestData.title
              } successfully updated!`
            );
            return res.status(200).send({
              success: true,
              msg: `estimation with the title ${
                estimation.requestData.title
              } successfully updated!`
            });
          }
        });
      }
    });
  } else {
    return res.status(400).send({
      success: false,
      msg: "no incoming data"
    });
  }
};

estimationController.showLast = (req, res) => {
  console.log("#########", req.query.id, req.query.title);
  Estimation.findOne({
    user: req.query.id,
    "requestData.title": req.query.title
  }).exec((err, lastEstimation) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("last estimation", lastEstimation);
      res.send({
        success: true,
        msg: "last estimation",
        data: lastEstimation
      });
    }
  });
};

module.exports = estimationController;

