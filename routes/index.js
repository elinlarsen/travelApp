const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const tripModel = require("../models/Trip.js");
tripHandler = new dbHandler(tripModel);
const stepsModel = require("../models/Step.js");
stepHandler = new dbHandler(stepsModel);

// -----------------------  main pages -----------------------

router.get("/", (req, res, next) => {
  console.log("Log in picture is " + logInPicture);
  res.render("index", { logInText, logInPicture, logInLink });
});

router.get("/main", (req, res, next) => {
  res.render("main", { logInText, logInPicture, logInLink });
});

// ----------------------- ABOUT -----------------------
router.get("/about", (req, res, next) => {
  res.render("about", { logInText, logInPicture, logInLink });
});

module.exports = router;
