const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

const authenticateUser = require("../middleware/validateUser");
const upload = require("../utils/multerUploader");
const uploadToCloudinary = require("../utils/uploadToClodinary");

router.post("/new", upload.array("pictures"), async (req, res) => {
  try {
    const { sellerId, title, descreption, prize } = req.body;

    uploadToCloudinary(req.files, async (pictures) => {
      const newPost = await Post({
        sellerId,
        title,
        descreption,
        prize,
        pictures,
      });

      await newPost.save();
      res.send({ ok: "Post stored to db" });
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.find({});
    res.send(allPosts);
  } catch (error) {
    console.log("Error fetching posts", error);
  }
});

module.exports = router;
