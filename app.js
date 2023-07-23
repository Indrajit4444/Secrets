require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: 'this is a secret key',
  resave: false,
  saveUninitialized: false,
}))
mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const User = require("./models/user");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  // console.log(req.session);

  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  var user = new User({username: req.body.username, password: req.body.password});
  console.log(user);
  req.login(user, function(err) {
    if (err) { res.send("login error") }
    else 
      passport.authenticate('local')(req, res, function () {
        res.redirect('/secrets');
      });
  });
});
app.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { res.send("can't log out")}
    else
      res.redirect('/login');
  });
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secrets", (req, res) => {
  console.log(req.sessionID,req.session);
  if (req.isAuthenticated()) res.render("secrets");
  else res.send("Unauthorized");
});
app.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) res.send("opps!! user already exist");
      else
      passport.authenticate('local')(req, res, function () {
        res.redirect('/secrets');
      }); 
    }
  );
});
app.listen(3000, () => {
  console.log("Server is Running on port 3000");
});
