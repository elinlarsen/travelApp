require("dotenv").config();
require("./config/db_connection");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Checking status for every route

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
//Registering partials
hbs.registerPartials(__dirname + "/views/partials");

//session

app.use(
  session({
    secret: "basic-auth-secret",
    cookie: {maxAge: 3600000*24*14},
    //cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

function isLoggedIn(req, res, next) {
  app.locals.isLoggedIn = Boolean(req.session.currentUser);
  next();
}
app.use(isLoggedIn);


app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});


function logInUser(req, res, next){
  if (req.session.currentUser) {
    app.locals.logInUser=req.session.currentUser
  }
  next();
}

app.use(logInUser);


// default value for title local
app.locals.title = "Travel App";
app.locals.site_URL = process.env.SITE_URL;

const index = require("./routes/index");
app.use("/", index);

const trips = require("./routes/tripsRouter");
app.use("/", trips);

const tripdetails = require("./routes/tripsdetailsRouter");
app.use("/", tripdetails);

const user = require("./routes/userRouter");
app.use("/", user);

const steps = require("./routes/stepsRouter");
app.use("/", steps);

module.exports = app;
