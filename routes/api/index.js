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
  destination: (req, file, callback) => {
    console.log("file", file);
    if (file.fieldname === "avatar") {
      let path = "./uploads/images/";

      callback(null, path);
    } else {
      let path = "./uploads/company_projects/";

      callback(null, path);
    }
  },

  filename: function(req, file, callback) {
    console.log("file__----", file, "file__mimetype------", file.mimetype);

    callback(null, file.originalname + "_" + uuidV4());
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

router.post("/api/user/save", userController.saveNewUser);

router.post(
  "/api/user/request/save",
  imageUpload.array("editedImages", 8),
  estimationController.saveNewEstimation
);

router.post(
  "/api/user/update",
  imageUpload.single("avatar"),
  userController.updateUser
);

//get all

router.get("/api/user/listAll", userController.listAll);
router.get("/api/user/showDetails", userController.showDetails);

router.get("/api/professional/listAll", professionalController.listAll);
router.get("/api/professional/showDetails", professionalController.showDetails);

router.get("/api/user/request/showLast", estimationController.showLast);

//upload an avatar image
router.post(
  "/api/professional/api/professional/save_images",
  professionalController.saveImages
);
router.post("/api/user/save_avatar", userController.saveAvatar);

//validate users || professionals login (we have to use one login for both)
router.post("/api/login", loginValidation);

module.exports = router;
