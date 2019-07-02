const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const userModel = require("../models/User.js");
const userHandler = new dbHandler(userModel);


// -----------------------  SIGN UP ----------------------- 
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});


// -----------------------  FRIENDS ----------------------- 
router.get('/friends', (req, res, next) => {
    res.render("friends")
})


module.exports = router;
