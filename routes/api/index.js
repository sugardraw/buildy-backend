const router = require("express").Router();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const userController = require("../../controllers/userController");
const professionalController = require("../../controllers/professionalController");
const estimationController = require("../../controllers/estimationController");

const uuidV4 = require("uuid/v4");
const cors = require("cors");

const storage = multer.diskStorage({
  destination: "./uploads/images/",
  filename: function(req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err);
      callback(null, raw.toString("hex") + path.extname(file.originalname));
    });
  }
});

//initializing multer
const imageUpload = multer({ storage: storage });
// console.log('+*******',imageUpload);

router.get("/", cors(), (req, res) => {
  res.send({
    init: "start"
  });
});

router.get("/api", cors(), (req, res) => {
  res.send({
    api: "edomus App - decoration app",
    authors: "Ansumana, Gaia and Sergio"
  });
});

/**
 *
 * testing routes
 * testing routes
 * testing routes
 *
 *  */

router.post(
  "/api/professionals/save",
  imageUpload.single("image"),
  professionalController.saveNewProfessional
);

router.post(
  "/api/user/save",
  imageUpload.single("avatar"),
  userController.saveNewUser
);

router.post(
  "/api/user/request-estimation/send",
  imageUpload.single("avatar"),
  estimationController.saveNewEstimation
);

module.exports = router;
