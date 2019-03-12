const router = require("express").Router();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const adminImgController = require("../../controllers/adminImgController");
const userController = require("../../controllers/userController");

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

router.get("/", cors(),(req, res) => {
  res.send({
    init: "start"
  });
});

router.get("/api",cors(), (req, res) => {
  res.send({
    api: "edomus App - decoration app",
    authors: "Ansumana, Gaia and Sergio"
  });
});

module.exports = router;
