const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const userModel = require("../models/User.js");
const userHandler = new dbHandler(userModel);
const fakeUsers=require('../bin/userSeed')


// -----------------------  SIGN UP ----------------------- 
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});


// -----------------------  FRIENDS ----------------------- 
router.get('/friends', (req, res, next) => {
    // -----------------------  INSERT FAKE DATA ----------------------- 
    //userHandler.insertMany(fakeUsers, dbres =>console.log("users added in db !!", dbres))
    res.render("friends")
   
})

router.get("/userData", (req, res, next) =>{
    userHandler.getAll(resData => {
        console.log("GET ALL ----",resData)
        res.send(resData)
      })
})

router.get("/userData/:id", (req, res, next) =>{
    let ID={_id: req.params.id}
    userHandler.getOneById(ID, resData => {
        console.log("GET ALL ----",resData)
        res.send(resData)
      })
})


module.exports = router;
