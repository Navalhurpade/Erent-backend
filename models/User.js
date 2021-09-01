const mongoose = require("mongoose");

const userSchama = mongoose.Schema({
  name: String,
  role: String,
  email: String,
  profile_pic: { type: String, default: null },
  password: String,
});

const User = mongoose.model("users", userSchama);

module.exports = User;
