require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const app = express();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const User = require("./models/user");

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {user: user.username});});
});
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.use(new LocalStrategy(User.authenticate()));
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    async function (accessToken, refreshToken, profile, cb) {
      let user = await User.findOne({ username:profile._json.email }).exec();
      // console.log(user);
      if (!user){
        user =new User ({
          username:profile._json.email,
          googleID:profile.id
        })
        await user.save();
      }
      return cb(null, user);
    }
  )
);

app.get("/", (req, res) => {
  // console.log(req.session);

  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  // console.log(user);
  req.login(user, function (err) {
    if (err) {
      res.send("login error");
    } else
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
  });
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      res.send("can't log out");
    } else res.redirect("/login");
  });
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secrets", async (req, res) => {
  if (req.isAuthenticated())
    res.render("secrets",{secrets:await User.find({secret:{$ne:null}})});
  else
    res.redirect("/login");
});
app.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) res.send("opps!! user already exist");
      else
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
    }
  );
});
app.get("/submit",(req,res)=>{
  if (req.isAuthenticated())
    res.render("submit");
  else res.redirect("/login");
});
app.post("/submit",async (req,res)=>{
  if (req.isAuthenticated()){
    await User.findOneAndUpdate({username: req.user.user},{secret: req.body.secret});
    res.redirect("/secrets");
  }
  else res.redirect("/login");
});
app.listen(3000, () => {
  console.log("Server is Running on port 3000");
});
