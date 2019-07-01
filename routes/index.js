const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");

const tripModel= require("../models/Trip.js");
const stepsModel = require("../models/Step.js");

tripHandler= new dbHandler(tripModel)
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


//GET TRIP DETAILS
router.get(["/tripdetails", "/tripdetails/:trip_id"], (req, res, next) => {
  res.render("tripdetails");
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
router.get("/about", (req, res, next) => {
  res.render("about");
});

// POST TRIP DETAILS
router.post("/tripdetails", (req, res, next) => {
  console.log(req.body);
  stepHandler.createOne(req.body);
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

});

// GET TRIP Data 
router.get('/tripsData', (req, res)=> {
  tripHandler.getAll(resData => {
    console.log(resData)
    res.send(resData)
  })
})

module.exports = router;
