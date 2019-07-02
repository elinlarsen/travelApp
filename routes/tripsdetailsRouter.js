const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const tripModel = require("../models/Trip.js");
tripHandler = new dbHandler(tripModel);


// ----------------------- TRIP DETAILS ----------------------- 
router.get("/tripdetails/:trip_id", (req, res, next) => {
    /* tripHandler.createOne({
      name: "Great Trip" + Math.random(),
      start_date: "01.02.2020",
      end_date: "01.03.2020"
    }); */
  
    tripHandler.getOneById(req.params.trip_id, tripResponse => {
      console.log("-----------", tripResponse);
      res.render("tripdetails", { tripResponse });
    });
  });


router.post("/tripdetails", (req, res, next) => {
    console.log(req.body);
    stepHandler.createOne(req.body, dbRes => res.send(dbRes._id));
  });
  

router.patch("/tripsdata/:id", (req, res, next) => {
    tripHandler.updateOne(
      { _id: req.params.id },
      req.body,
      dbRes => console.log("Data patched")
    );
  });
  

/*router.get("/trips/:trip_id", (req, res, next) => {
  console.log("ready to serve trip " + req.params.trip_id);
  tripHandler.getOneById(req.params.trip_id, response => res.send(response));
});
*/
  

module.exports = router;