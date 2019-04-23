const mongoose = require("mongoose");

const Professional = require("../models/Professional");
const Session = require("../models/Session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jwt-simple");
const moment = require("moment");
const config = require("../config");

// we create a token with JWT

function createToken(professional) {
  if (!professional && !professional._id) {
    return null;
  }
  let payload = {
    sub: professional._id,
    iat: moment().unix(),
    exp: moment()
      .add(14, "days")
      .unix()
  };

  return jwt.encode(payload, config.SECRET_TOKEN);
}

const professionalController = {};

professionalController.listAll = (req, res) => {
  Professional.find({}, (err, professionalList) => {
    res.send(professionalList);
  });
};

professionalController.showDetails = (req, res) => {
  console.log(req.query.id);
  Professional.find({ _id: req.query.id }, (err, professional) => {
    if (err) {
      throw err;
    } else {
      res.send(professional);
    }
  });
};

professionalController.saveNewProfessional = (req, res) => {
  console.log("req body from company registration", "body_____>:",req.body,"files________>:" ,req.files);

  const body = JSON.parse(req.body.professional);
  console.log(body.email, body.password);
  if (body.email !== "" || body.email !== undefined) {
    Professional.find({ email: body.email }, (err, registeredProfessionals) => {
      if (err) {
        return res.send("Registration failed. Server error");
      } else if (registeredProfessionals.length > 0) {
        return res.send({
          isRegistered: true,
          msg: "already registered"
        });
      } else {
        bcrypt
          .genSalt(saltRounds)
          .then(salt => {
            console.log(`Salt: ${salt}`);
            return bcrypt.hash(body.password, salt);
          })
          .then(hash => {
            console.log(`Hash: ${hash}`);
            body.password = hash;
            body.avatar = req.files.avatar;
            body.projectImages = req.files.projectImages;

            const professional = new Professional(body);
            professional._id = new mongoose.Types.ObjectId();
            let token = createToken(professional);

            professional.save(error => {
              if (error) {
                console.log(error);
                res.send(error);
              } else {
                console.log("Professional was saved successfully");
                return res.send({
                  success: true,
                  msg: "Professional registration successful :)!",
                  token: token
                });
              }
            });
          })
          .catch(err => console.error(err.message));
      }
    });
  } else {
    res.send(
      "Registration failed. Make sure You fulfilled correctly all fields"
    );
  }
};

professionalController.saveImages = (req, res) => {
  console.log("professionalController.saveImages", req.body, req.body._parts);
  res.send("testing upload avatar");
};

module.exports = professionalController;
