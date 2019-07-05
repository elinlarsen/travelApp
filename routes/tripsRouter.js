const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const tripModel = require("../models/Trip.js");
const tripHandler = new dbHandler(tripModel);

const userModel = require("../models/User.js");
const userHandler=new dbHandler(userModel)

const countryModel = require("../models/Country.js");
const countryHandler = new dbHandler(countryModel);
const countries = require("../bin/countries.js");

const multer = require("multer");
const upload = multer({ dest: "./public/uploads/" });
const changeDateFormat = require("../utils/changeDateFormat");
const moment = require("moment");

const ensureAuthenticated=require("../bin/ensureAuth.js")

//-----------------------  INSERT countries in db -----------------------
//do it once !
//countryHandler.insertMany(countries, dbres =>console.log("countries inserted in db"))

// -----------------------  GET ALL Countries -----------------------
router.get("/countries.json", (req, res) => {
  countryHandler.getAll(resData => {
    res.send(resData);
  });
});

router.get("/trip_edit/countries.json", ensureAuthenticated, (req, res) => {
  countryHandler.getAll(resData => {
    res.send(resData);
  });
});

// -----------------------  GET ALL TRIPS  -----------------------
router.get("/trips", ensureAuthenticated, (req, res) => {
  res.render("trips");
});

  //todo : create route /users/:id/trips

router.get("/users/:id/trips", ensureAuthenticated, (req, res) => {
  let userId=req.params.id;
  res.render("trips", {userId,})
});  
// /tripsdetails/:id

router.get("/tripsData", (req, res) => {
  tripHandler.getAll(resData => {
    res.send(resData);
  });
});

// ----------------------- ADD TRIP  -----------------------
router.get("/trip_add/:id", ensureAuthenticated, (req, res) => {
  res.render("newTripForm");
});


router.post("/trip_add/:id", upload.single("picture"), (req, res) => {
  console.log(" hello world this is a post")
  let userId= req.params.id;
  let countriesArr = req.body.countries.split(",");
  console.log("countries -------", countriesArr);
  console.log("req.body -----------", req.body);
  const newTrip = new tripModel({
    name: req.body.name,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    countries: countriesArr,
    picture: `/../uploads/${req.file.filename}`
  });

  tripHandler.createOne(newTrip, dbres => {
      let newtripId=dbres._id
      userHandler.getOne({_id: userId }, (user) => {
        existingTrips=user.trips
        existingTrips.push(newtripId)
        userHandler.updateOne(  {_id: userId } , {trips : existingTrips}, (dbres) =>{
            res.redirect(`/users/${userId}/trips`)
        })  
      })
  });
});

//  -----------------------  EDIT TRIP  -----------------------
router.get("/trip_edit/:trip_id", ensureAuthenticated, (req, res) => {
  tripHandler.getOneById(req.params.trip_id, trip => {
    let start = moment().format("L");
    start=changeDateFormat(trip.start_date);
    let end = moment().format("L");
    end=changeDateFormat(trip.end_date);
    console.log("start-------", start, "--------end--------", end);
    console.log("trip", trip)
    
    res.render(
      "editTripForm",
      { trip, start, end}
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
    picture: `/../uploads/${req.file.filename}`,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  });
  console.log("ID ----------- ", ID);
  console.log("START DATE ------", req.body.start_date);
  console.log("END DATE ------", req.body.end_date);
  tripHandler.updateOne(ID, editedTrip, dbRes => {
    console.log("Edited trip patched! ---------------- edited Trip : ", dbRes);
    console.log("req.session.currentUser", req.session.currentUser)
    let ID=req.session.currentUser._id;
    
    res.redirect(`/users/${ID}/trips/`);
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
