const mongoose = require("mongoose");
const jwt = require("jwt-simple");
const moment = require("moment");
const config = require("../config");

const Professional = require("../models/Professional");
const User = require("../models/User");
const EstimationRequest = require("../models/Estimation");
const Session = require("../models/Session");

const bcrypt = require("bcrypt");

function verifyToken(token) {
  return jwt.verify(token, config.SECRET_TOKEN);
}

function createToken(person) {
  let payload = {
    sub: person._id,
    iat: moment().unix(),
    exp: moment()
      .add(14, "days")
      .unix()
  };

  return jwt.encode(payload, config.SECRET_TOKEN);
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
                Session.find({ userId: registeredUsers[0]._id }).exec(
                  (errors, session) => {
                    if (errors) {
                      console.log("error:", error);
                    } else if (!session) {
                    } else {
                      const sessionObj = {
                        userId: registeredUsers[0]._id,
                        token: session[0].token
                      };
                      const newSession = new Session(sessionObj);
                      console.log(registeredUsers[0].avatar)
                      newSession.save(error => {
                        if (error) {
                          console.log(error);
                          res.send(error);
                        } else {
                          return res.status(200).send({
                            success: true,
                            msg: "User registration was successful :)!",
                            token: sessionObj.token,
                            avatar: registeredUsers[0].avatar
                          });
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          try {




            Professional.find(
              { email: req.body.email },
              (err, registeredProfessionals) => {
                if (err) {
                  return res.send("Registration failed. Server error");
                } else if (registeredProfessionals.length > 0) {
                  bcrypt.compare(
                    req.body.password,
                    registeredProfessionals[0].password,
                    (err, response) => {
                      if (err) {
                        return err;
                      } else {
                        const sessionObj = {
                          profId: registeredProfessionals[0]._id
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
                              token: createToken(registeredProfessionals[0]),
                              avatar: "/"+registeredProfessionals[0].avatar[0].path,
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
            console.log(error);
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
