const mongoose = require("mongoose");
const jwt = require("jwt-simple");
const moment = require("moment");
const config = require("../config");

const Professional = require("../models/Professional");
const User = require("../models/User");
const EstimationRequest = require("../models/EstimationRequest");
const Session = require("../models/Session");

const bcrypt = require("bcrypt");

function verifyToken(token) {
  return jwt.verify(token, config.SECRET_TOKEN);
}

// userController.checkToken = (req, res) => {
//   console.log(req.headers);
//   const token = req.headers.authorization;
//   if (token) {
//     const arr = token.split(" ");
//     if (arr[0] === "Bearer" && arr[1]) {
//       try {
//         return verifyToken(arr[1]);
//       } catch (error) {
//         return null;
//       }
//     }
//     Session.find({ token: req.body.token }).exec((errors, session) => {
//       if (errors) {
//         console.log("error:", error);
//       } else {
//         res.send(session);
//       }
//     });
//   }

//   return null;
// };

function loginValidation(req, res) {
  console.log("#####", req.headers.authorization, req.body.params, req.body);

  if (req.body.email !== "" || req.body.email !== undefined) {
    try {
      User.find({ email: req.body.email }, (err, registeredUsers) => {
        if (err) {
          return res.send("Registration failed. Server error");
        } else if (registeredUsers.length > 0) {
          bcrypt.compare(
            req.body.password,
            registeredUsers[0].password,
            (err, response) => {
              if (err) {
                return err;
              } else {
                const sessionObj = {
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
                      msg: "you are successfully logged",
                      type: "user"
                    });
                  }
                });
              }
            }
          );
        } else {
          try {
            Professional.find(
              { email: req.body.email },
              (err, registeredUsers) => {
                if (err) {
                  return res.send("Registration failed. Server error");
                } else if (registeredUsers.length > 0) {
                  bcrypt.compare(
                    req.body.password,
                    registeredUsers[0].password,
                    (err, response) => {
                      if (err) {
                        return err;
                      } else {
                        const sessionObj = {
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
                              msg: "you are successfully logged",
                              type: "professional"
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
          } catch (error) {
            return null;
          }
        }
      });
    } catch (error) {
      return null;
    }
  } else {
    res.send("Login failed. Make sure You fulfilled correctly all fields");
  }
}

module.exports = {
  verifyToken,
  loginValidation
};
