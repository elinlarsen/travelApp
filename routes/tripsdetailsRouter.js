const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const tripModel = require("../models/Trip.js");
const tripHandler = new dbHandler(tripModel);
const changeDateFormat = require("../utils/changeDateFormat");
const ensureAuthenticated=require("../bin/ensureAuth.js")

// ----------------------- TRIP DETAILS -----------------------
router.get("/tripdetails/:trip_id", ensureAuthenticated,(req, res, next) => {
  /* tripHandler.createOne({
      name: "Great Trip" + Math.random(),
      start_date: "01.02.2020",
      end_date: "01.03.2020"
    }); */

  let currentUser=req.session.currentUser
  if (req.session.currentUser) userId = req.session.currentUser._id;
  else userId = "";

  console.log("req.params.trip_id", req.params.trip_id);
  tripHandler.getOneById(req.params.trip_id, tripResponse => {
    console.log("-----------", tripResponse);
    console.log("----------- start in db", tripResponse.start_date);
    console.log("----------- end in db", tripResponse.end_date);
    let start = changeDateFormat(tripResponse.start_date);
    let end = changeDateFormat(tripResponse.end_date);
    let countries=tripResponse.countries.join(" & ")
    res.render("tripdetails", {
      tripResponse,
      countries,
      start,
      end,
      userId
    });
  });
});

router.post("/tripdetails", ensureAuthenticated , (req, res, next) => {
  console.log(req.body);
  stepHandler.createOne(req.body, dbRes => res.send(dbRes._id));
});

router.patch("/tripsData/:id", ensureAuthenticated, (req, res, next) => {
  tripHandler.updateOne({ _id: req.params.id }, req.body, dbRes => {
    res.send(dbRes);
  });
});

/*router.get("/trips/:trip_id", (req, res, next) => {
  console.log("ready to serve trip " + req.params.trip_id);
  tripHandler.getOneById(req.params.trip_id, response => res.send(response));
});
*/

module.exports = router;
