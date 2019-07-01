const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
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

router.get("/tripdetails", (req, res, next) => {
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
