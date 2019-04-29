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
  console.log("user._id  create token", user._id);
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

userController.showDetails = (req, res) => {
  console.log("###", req.query.id);
  User.find({ _id: req.query.id }, (err, user) => {
    if (err) {
      throw err;
    } else {
      res.send(user);
    }
  });
};

userController.saveNewUser = (req, res) => {
  console.log(req.body, req.file);

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
            let token = createToken(user);

            user.save(error => {
              if (error) {
                res
                  .status(500)
                  .send({ message: `Error creating user: ${error}` });
              } else {
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

userController.updateUser = (req, res) => {
  console.log("req.query", req.query, req.body, req.file, req.params);

  const newUser = {
    avatar: req.body.avatar,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    city: req.body.city,
    street: req.body.street,
    zip: req.body.zip
  };

  User.findOneAndUpdate(
    { _id: req.query.id },
    { $set: newUser },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.send({ status: false, msg: "Something wrong when updating data!" });
        console.log("Something wrong when updating data!");
      } else {
        console.log(updatedUser);
        res.send({
          status: true,
          msg: "user information was updated",
          data: updatedUser
        });
      }
    }
  );
};

userController.saveAvatar = (req, res) => {
  console.log("userController.saveAvatar", req.body, req.body._parts);
  return res.send({
    status: true
  });
};

module.exports = userController;
