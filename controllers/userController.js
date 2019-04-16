const mongoose = require("mongoose");

const User = require("../models/User");
const Session = require("../models/Session");
const Estimation = require("../models/Estimation");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jwt-simple");
const moment = require("moment");
const config = require("../config");

// we create a token with JWT

function createToken(user) {
  if (!user && !user._id) {
    return null;
  }
  let payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment()
      .add(14, "days")
      .unix()
  };

  return jwt.encode(payload, config.SECRET_TOKEN);
}

const userController = {};

userController.listAll = (req, res) => {
  User.find({}, (err, userList) => {
    res.send(userList);
  });
};

userController.saveNewUser = (req, res) => {
  console.log(req.body);

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
            let token = createToken(user);
            user._id = new mongoose.Types.ObjectId();

            user.save(error => {
              if (error) {
                res
                  .status(500)
                  .send({ message: `Error creating user: ${error}` });
              } else {
                const estimation = new Estimation({
                  user: user._id,
                  requestData: {},
                  editedImages: [{}]
                });
                estimation.save(function(err) {
                  if (err) return handleError(err);
                });

                const sessionObj = {
                  token: token,
                  userId: user._id
                };

                const session = new Session(sessionObj);
                session.save(error => {
                  if (error) {
                    console.log(error);
                    res.send(error);
                  } else {
                    console.log("token saved");
                    return null;
                  }
                });
                console.log("User was created successfully");
                return res.status(200).send({
                  success: true,
                  msg: "User registration was successful :)!",
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

userController.saveAvatar = (req, res) => {
  console.log("userController.saveAvatar", req.body, req.body._parts);

  
  return res.send({
    status: true
  });
};

module.exports = userController;
