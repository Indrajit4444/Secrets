const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  // {
  //   type: String,
  //   unique: true,
  //   required: true
  // },
  password: String,
  googleID: String,
  secret: String
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);