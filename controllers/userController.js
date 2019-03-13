const mongoose = require("mongoose");

const User = require("../models/User");
const Session = require("../models/Session");
const EstimationRequest = require("../models/EstimationRequest");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {};

userController.listAll = (req, res) => {
  User.find({}, (err, userList) => {
    res.send(userList);
  });
};

userController.saveNewUser = (req, res) => {
  if (req.body.email !== "" || req.body.email !== undefined) {
    User.find({ email: req.body.email }, (err, registeredUsers) => {
      if (err) {
        return res.send("Registration failed. Server error");
      } else if (registeredUsers.length > 0) {
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
            const user = new User(req.body);
            user._id = new mongoose.Types.ObjectId();

            user.save(error => {
              if (error) {
                console.log(error);
                res.send(error);
              } else {
                console.log("User was created successfully");

                return res.send({
                  success: true,
                  msg: "User registration was successful :)!"
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

userController.validateUser = (req, res) => {
  console.log("#####", req.body.params.token, req.body.data);

  if (req.body.data.email !== "" || req.body.data.email !== undefined) {
    User.find({ email: req.body.data.email }, (err, registeredUsers) => {
      if (err) {
        return res.send("Registration failed. Server error");
      } else if (registeredUsers.length > 0) {
        bcrypt.compare(
          req.body.data.password,
          registeredUsers[0].password,
          (err, response) => {
            if (err) {
              return err;
            } else {
              const sessionObj = {
                token: req.body.params.token,
                userId: registeredUsers[0]._id
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
    });
  } else {
    res.send(
      "Registration failed. Make sure You fulfilled correctly all fields"
    );
  }
};

userController.checkToken = (req, res) => {
  console.log("******", req.body.token, req.body);
  Session.find({ token: req.body.token }).exec((errors, session) => {
    if (errors) {
      console.log("error:", error);
    } else {
      res.send(session);
    }
  });
};

module.exports = userController;
