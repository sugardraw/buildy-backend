const mongoose = require("mongoose");

const Professional = require("../models/Professional");
const Session = require("../models/Session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const professionalController = {};

professionalController.saveNewProfessional = (req, res) => {
  console.log(req.body);

  if (req.body.email !== "" || req.body.email !== undefined) {
    Professional.find(
      { email: req.body.email },
      (err, registeredProfessionals) => {
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
              return bcrypt.hash(req.body.password, salt);
            })
            .then(hash => {
              console.log(`Hash: ${hash}`);
              req.body.password = hash;
              const professional = new Professional(req.body);

              professional.save(error => {
                if (error) {
                  console.log(error);
                  res.send(error);
                } else {
                  console.log("Professional was saved successfully");
                  return res.send({
                    success: true,
                    msg: "Registration successful :)!"
                  });
                }
              });
            })
            .catch(err => console.error(err.message));
        }
      }
    );
  } else {
    res.send(
      "Registration failed. Make sure You fulfilled correctly all fields"
    );
  }
};

professionalController.validateProfessional = (req, res) => {
  console.log("#####", req.body.params.token, req.body.data);

  if (req.body.data.email !== "" || req.body.data.email !== undefined) {
    Professional.find(
      { email: req.body.data.email },
      (err, registeredProfessionals) => {
        if (err) {
          return res.send("Registration failed. Server error");
        } else if (registeredProfessionals.length > 0) {
          bcrypt.compare(
            req.body.data.password,
            registeredProfessionals[0].password,
            (err, response) => {
              if (err) {
                return err;
              } else {
                const sessionObj = {
                  token: req.body.params.token,
                  ProfessionalId: registeredProfessionals[0]._id
                };

                const session = new Session(sessionObj);
                session.save(error => {
                  if (error) {
                    console.log(error);
                    res.send(error);
                  } else {
                    console.log("token saved");
                    return res.send({
                      success: true,
                      isLogged: true,
                      msg1: "Token created and saved :)!",
                      msg2: "you are successfully logged"
                    });
                  }
                });
              }
            }
          );
        } else {
          return res.send({
            isRegistered: false,
            msg: "you are not registered"
          });
        }
      }
    );
  } else {
    res.send(
      "Registration failed. Make sure You fulfilled correctly all fields"
    );
  }
};

professionalController.checkToken = (req, res) => {
  console.log("******", req.body.token, req.body);
  Session.find({ token: req.body.token }).exec((errors, session) => {
    if (errors) {
      console.log("error:", error);
    } else {
      res.send(session);
    }
  });
};

module.exports = professionalController;
