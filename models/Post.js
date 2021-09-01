const mongoose = require("mongoose");

const postScheam = mongoose.Schema({
  sellerId: { type: mongoose.Types.ObjectId, ref: "users" },
  title: String,
  pictures: [String],
  descreption: String,
  prize: String,
});

const Post = new mongoose.model("posts", postScheam);

module.exports = Post;
