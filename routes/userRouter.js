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
const ensureAuthenticated=require("../bin/ensureAuth.js")

// -----------------------  SIGN UP -----------------------
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", upload.single("picture"), (req, res, next) => {
  const { first_name, last_name, username, email, password } = req.body;
  picture = `/../uploads/${req.file.filename}`;

  console.log(req.body);

  userModel
    .findOne({ first_name: first_name, last_name: last_name })
    .then(queryResult => {
      console.log("queryResult (the user exist or not ?)" + queryResult);
      if (queryResult !== null) {
        console.log("user found");
        res.render("auth/signup", {
          errorMessage: "This user already exist - Please use a different one"
        });
      } else {
        console.log("I am dealing with a new user");
        const hashpwd = bcrypt.hashSync(password, salt);
        user = {
          first_name,
          last_name,
          username,
          picture,
          email,
          password: hashpwd
        };
        //console.log (userObject);
        userModel
          .create(user)
          .then(dbRes => {
            req.session.currentUser = user;
            res.redirect(`/users/${dbRes._id}/trips/`);
            console.log("Account created ---- dbres", dbRes);
          })
          .catch(err => console.log("sign up did not work", err));
      }
    })
    .catch(err => "username query does not work");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

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
        req.session.currentUser = user;
        
        /*req.session.picture = user.picture;
        logInText = "Welcome " + req.session.currentUser.first_name;
        logInLink = "/trips";
        logInPicture = user.picture;
        */
        res.redirect(`/users/${user._id}/trips`);
      } else {
        console.log("error pwd");
        res.render("auth/login", { errorMessage: "Incorrect password !" });
      }
    }
  });
});

// -----------------------  FRIENDS -----------------------
router.get("/friends", ensureAuthenticated, (req, res, next) =>{
  //userHandler.insertMany(fakeUsers, dbres =>{res.render("friends")})
  res.render("friends")
})
router.get("/users/:id/friends", ensureAuthenticated, (req, res, next) => {
  res.render("friends")
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

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    console.log("logout ");
    res.redirect("home");
  });
});

// -----------------------  ADD A FRIEND -----------------------
router.get("/friend_add", ensureAuthenticated, (req, res, next) => {
  res.render("newFriend");
});

router.get("/users/:id/friend_add/", ensureAuthenticated, (req, res) => {
    res.render("newFriend");  
});

//<input type="text" placeholder="Search..">
// -----------------------  SHARE-----------------------
router.get("/share", ensureAuthenticated, (req, res, next) => {
  res.render("shareTrip");
});

router.get("/users/:id/share/", ensureAuthenticated, (req, res) => {
  res.render("shareTrip");
});
module.exports = router;
