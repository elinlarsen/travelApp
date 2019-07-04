const express = require("express");
const router = express.Router();
const dbHandler = require("../bin/dblhandler.js");
const userModel = require("../models/User.js");
const userHandler = new dbHandler(userModel);
const fakeUsers = require("../bin/userSeed");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads/" });
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);

// -----------------------  SIGN UP -----------------------
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", upload.single("picture"), (req, res, next) => {
  const { first_name, last_name, username, email, password } = req.body;
  picture = `../uploads/${req.file.filename}`;

  console.log(req.body);
  userModel
    .findOne({ first_name: first_name, last_name: last_name })
    .then(queryResult => {
      console.log("q" + queryResult);
      if (queryResult !== null) {
        console.log("user found");
        res.render("auth/signup", {
          errorMessage: "This user already exist - Please use a different one"
        });
      } else {
        console.log("I am dealing with a new user");
        const hashpwd = bcrypt.hashSync(password, salt);
        userObject = {
          first_name,
          last_name,
          username,
          picture,
          email,
          password: hashpwd
        };
        //console.log (userObject);
        userModel
          .create(userObject)
          .then(() => {
            res.redirect("/trips");
            console.log("Account created");
          })
          .catch(err => console.log("sign up did not work"));
      }
    })
    .catch(err => "username query does not work");

  /*    userHandler.createOne(req.body, response => {
    console.log(req.body);
    console.log("entry created");
  }); */
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  //console.log(req.body)
  userModel.findOne({ email }).then(user => {
    if (!user) {
      console.log("no user ");
      let logInStatus = req => (req.session.currentUser ? true : false);
      res.render("auth/login", {
        errorMessage:
          "User doesn't exist. Please, try again or create an account.",
        logInStatus
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        //let logInStatus = req.session.currentUser ? true : false;
        req.session.currentUser = user;
        logInText = "Welcome " + req.session.currentUser.username;
        res.render("trips", {
          logInText
        });
      } else {
        console.log("error pwd");
        res.render("auth/login", { errorMessage: "Incorrect password !" });
      }
    }
  });
});

// -----------------------  FRIENDS -----------------------
router.get("/friends", (req, res, next) => {
  // -----------------------  INSERT FAKE DATA -----------------------
  //try{userHandler.insertMany(fakeUsers, dbres =>{res.render("friends")})}
  //catch{
  res.render("friends");
  //}
});

router.get("/usersData", (req, res, next) => {
  userHandler.getAll(resData => {
    console.log("GET ALL ----", resData);
    res.send(resData);
  });
});
router.get("/usersData/:id", (req, res, next) => {
  let ID = { _id: req.params.id };
  userHandler.getOneById(ID, resData => {
    console.log("GET ALL ----", resData);
    res.send(resData);
  });
});

module.exports = router;
