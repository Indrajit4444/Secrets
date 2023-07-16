require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const DB = require(__dirname + "/DB.js");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

DB.connect("mongodb://127.0.0.1:27017/userDB");

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  (async () => {
    const user = await DB.find({ email: req.body.username });
    // console.log(user);
    bcrypt.compare(req.body.password, user[0].password, function(err, result) {
        if (result) res.render("secrets");
    });
  })();
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    (async () => {
      await DB.insert({
        email: req.body.username,
        password: hash
      });
      res.render("secrets");
    })();
  });
});
app.listen(3000, () => {
  console.log("Server is Running on port 3000");
});
