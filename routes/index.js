const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const tripModel = require("../models/Trip.js");
tripHandler = new dbHandler(tripModel);
const stepsModel = require("../models/Step.js");
stepHandler = new dbHandler(stepsModel);

const multer  = require('multer');
const upload = multer({ dest: './public/uploads/' });

// GET main pages

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

//GET SIGN UP
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/trips/:trip_id", (req, res, next) => {
  console.log("ready to serve trip " + req.params.trip_id);
  tripHandler.getOneById(req.params.trip_id, response => res.send(response));
});

router.get("/tripdetails/:trip_id", (req, res, next) => {
  /* tripHandler.createOne({
    name: "Great Trip" + Math.random(),
    start_date: "01.02.2020",
    end_date: "01.03.2020",
    steps: [
      "5d19bb1631633f0dac8a1838",
      "5d19c5ed31dd2a3f3cb691dc",
      "5d19f5fa3326230790e1b9f0"
    ]
  }); */

  tripHandler.getOneById(req.params.trip_id, tripResponse => {
    console.log("-----------", tripResponse);
    res.render("tripdetails", {tripResponse})
  })

  

});

//GET TRIPS
router.get('/trips', (req, res) =>{
  res.render('trips')
})

//GET ADD TRIP
router.get('/trip_add', (req, res) =>{
  res.render('newTripForm')
})

//GET ABOUT
router.get("/steps/:step_id", (req, res, next) => {
  stepHandler.getOneById(req.params.step_id, response => {
    console.log(response);
    res.send(response);
  });
});

router.get("/about", (req, res, next) => {
  res.render("about");
});

// POST TRIP DETAILS
router.post("/tripdetails", (req, res, next) => {
  console.log(req.body);
  stepHandler.createOne(req.body, dbRes => res.send(dbRes._id));
});

//POST ADD TRIPS
router.post('/trip_add', upload.single('picture'), (req, res) => {

  const newTrip = new tripModel({
    name: req.body.name,
    picture: `../uploads/${req.file.filename}`,
    start_date : req.body.start_date,
    end_date : req.body.end_date,  
  });

  tripHandler.createOne(newTrip)
  res.redirect('/trips')

});

// GET TRIP Data 
router.get('/tripsData', (req, res)=> {
  tripHandler.getAll(resData => {
    console.log(resData)
    res.send(resData)
  })
})



module.exports = router;
