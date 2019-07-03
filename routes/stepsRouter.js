const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const stepsModel = require("../models/Step.js");
const stepHandler = new dbHandler(stepsModel);

router.get("/steps/:step_id", (req, res, next) => {
  stepHandler.getOneById(req.params.step_id, response => {
    console.log(response);
    res.send(response);
  });
});

router.patch("/steps/:id", (req, res, next) => {
  stepHandler.updateOne({ _id: req.params.id }, req.body, dbRes => {
    res.send(dbRes);
  });
});

module.exports = router;
