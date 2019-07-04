const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const tripModel = require("../models/Trip.js");
const tripHandler = new dbHandler(tripModel);

const countryModel = require("../models/Country.js");
const countryHandler = new dbHandler(countryModel);
const countries = require("../bin/countries.js");

const multer = require("multer");
const upload = multer({ dest: "./public/uploads/" });
const changeDateFormat = require("../utils/changeDateFormat");
const moment = require("moment");

//-----------------------  INSERT countries in db -----------------------
//do it once !
//countryHandler.insertMany(countries, dbres =>console.log("countries inserted in db"))

// -----------------------  GET ALL Countries -----------------------
router.get("/countries.json", (req, res) => {
  countryHandler.getAll(resData => {
    res.send(resData);
  });
});

router.get("/trip_edit/countries.json", (req, res) => {
  countryHandler.getAll(resData => {
    res.send(resData);
  });
});

// -----------------------  GET ALL TRIPS  -----------------------
router.get("/trips", (req, res) => {
  res.render("trips", { logInText, logInPicture, logInLink });
});

  //todo : create route /users/:id/trips

router.get("/users/:id/trips", (req, res) => {
  res.render("trips")
});  
// /tripsdetails/:id

router.get("/tripsData", (req, res) => {
  tripHandler.getAll(resData => {
    //console.log("GET ALL ----",resData)
    res.send(resData);
  });
});

// ----------------------- ADD TRIP  -----------------------
router.get("/trip_add", (req, res) => {
  res.render("newTripForm", { logInText, logInPicture, logInLink });
});

router.post("/trip_add", upload.single("picture"), (req, res) => {
  let countriesArr = req.body.countries.split(",");
  console.log("countries -------", countriesArr);
  console.log("req.body -----------", req.body);
  const newTrip = new tripModel({
    name: req.body.name,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    countries: countriesArr,
    picture: `../uploads/${req.file.filename}`
  });
  tripHandler.createOne(newTrip, dbres => {
    console.log("dbres -------", dbres);
    res.redirect("/trips");
  });
});

//  -----------------------  EDIT TRIP  -----------------------
router.get("/trip_edit/:trip_id", (req, res) => {
  tripHandler.getOneById(req.params.trip_id, trip => {
    let start = moment().format("L");
    changeDateFormat(trip.start_date);
    let end = moment().format("L");
    changeDateFormat(trip.end_date);
    console.log("start-------", start, "--------end--------", end);
    res.render(
      "editTripForm",
      { trip, start, end },
      { logInText, logInPicture, logInLink }
    );
  });
});

router.post("/tripsData/:id", upload.single("picture"), (req, res) => {
  const ID = { _id: req.params.id };
  let countriesArr = req.body.countries.split(",");
  console.log("countries -------", countriesArr);
  const editedTrip = new tripModel({
    _id: req.params.id,
    countries: countriesArr,
    name: req.body.name,
    picture: `../uploads/${req.file.filename}`,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  });
  console.log("ID ----------- ", ID);
  console.log("START DATE ------", req.body.start_date);
  console.log("END DATE ------", req.body.end_date);
  tripHandler.updateOne(ID, editedTrip, dbRes => {
    console.log("Edited trip patched! ---------------- edited Trip : ", dbRes);
    res.redirect("/trips");
  });
});

// ----------------------- GET ONE TRIP -----------------------
router.get("/tripsData/:trip_id", (req, res) => {
  let ID = req.params.trip_id;
  tripHandler.getOne({ _id: ID }, resData => {
    console.log("ID ------", { _id: ID });
    console.log("GET ONE -------", resData);
    res.send(resData);
  });
});

// ----------------------- DELETE ONE TRIP -----------------------
router.delete("/tripsData/:trip_id", (req, res) => {
  let ID = req.params.trip_id;
  console.log({ _id: ID });
  tripHandler.deleteOne({ _id: ID }, resData => {
    console.log("ID ------", { _id: ID });
    console.log("DELETING ONE -------", resData);
  });
});

module.exports = router;
