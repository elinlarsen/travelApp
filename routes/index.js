const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const tripModel = require("../models/Trip.js");
tripHandler = new dbHandler(tripModel);
const stepsModel = require("../models/Step.js");
stepHandler = new dbHandler(stepsModel);

// GET main pages

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/trips/:trip_id", (req, res, next) => {
  console.log("ready to serve trip " + req.params.trip_id);
  tripHandler.getOneById(req.params.trip_id, response => res.send(response));
});

router.get(["/tripdetails", "/tripdetails/:trip_id"], (req, res, next) => {
  tripHandler.createOne({
    name: "Great Trip" + Math.random(),
    start_date: "01.02.2020",
    end_date: "01.03.2020",
    steps: ["5d19bb1631633f0dac8a1838", "5d19c5ed31dd2a3f3cb691dc"]
  });

  res.render("tripdetails");
});

router.get("/about", (req, res, next) => {
  res.render("about");
});

router.post("/tripdetails", (req, res, next) => {
  console.log(req.body);
  stepHandler.createOne(req.body);
});

module.exports = router;
