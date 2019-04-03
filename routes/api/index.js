const router = require("express").Router();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const userController = require("../../controllers/userController");
const professionalController = require("../../controllers/professionalController");
const estimationController = require("../../controllers/estimationController");

const { loginValidation } = require("../../authServices/index");

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
    api: "Buildy App - decoration app",
    authors: "Ansumana Baboe, Gaia Cicaloni and Sergio Usle"
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
  "/api/professional/save",
  imageUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "projectImages", maxCount: 8 }
  ]),
  professionalController.saveNewProfessional
);

router.post(
  "/api/user/save",
  imageUpload.single("avatar"),
  userController.saveNewUser
);

router.post(
  "/api/user/request/save",
  imageUpload.array("editedImages", 8),
  estimationController.saveNewEstimation
);

//get all

router.get("/api/user/listAll", userController.listAll);
router.get("/api/professional/listAll", professionalController.listAll);

//upload an avatar image
// router.get("/api/user/save_avatar", userController.saveAvatar);
router.post("/api/user/save_avatar", userController.saveAvatar);

//validate users || professionals login (we have to use one login for both)
router.post("/api/login", loginValidation);

module.exports = router;
