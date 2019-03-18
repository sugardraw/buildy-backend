const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const MONGO_URI = require("dotenv").config();
const app = express();
const port = process.env.PORT || 3001;

// body parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

//set an static route to show the images

app.use("/uploads/images", express.static(__dirname + "/uploads/images"));
mongoose
  .connect(MONGO_URI.parsed.MONGO_URI, { useNewUrlParser: true })
  .then(console.log("Successful connection to database"))
  .catch(error => {
    console.log(`The following error occurred: ${error.message}`);
  });

//requiring routes
const routes = require("./routes/api/index");

//Use Routes
app.use("/", routes);

app.listen(port, () => console.log(`server started on port ${port}`));
