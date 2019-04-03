const mongoose = require("mongoose");
const fs = require("fs");

const User = require("../models/User");
const Estimation = require("../models/Estimation");

const estimationController = {};

estimationController.saveNewEstimation = (req, res) => {
  if (req.body !== null || req.body !== undefined) {
    Estimation.findOne(
      {
        user: req.body._parts[0][1].user,
        "requestData.title":
          req.body._parts[0][1].requestData.requestData.title,
        "requestData.description":
          req.body._parts[0][1].requestData.requestData.description
      },
      (err, estimation) => {
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
          console.log(
            "estimation",
            estimation,
            "estimation.requestData.title",
            estimation.requestData.title,
            "req.body._parts[0][1].requestData.requestData.title",
            req.body._parts[0][1].requestData.requestData.title,
            "estimation.editedImages",
            estimation.editedImages
          );

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
      }
    );
  } else {
    return res.status(400).send({
      success: false,
      msg: "no incoming data"
    });
  }
};

module.exports = estimationController;
