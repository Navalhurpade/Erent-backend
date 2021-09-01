require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;

const auth = require("./routes/auth.js");
const post = require("./routes/posts");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Working !!!");
});

app.use("/auth", auth);
app.use("/post", post);

mongoose.connect(process.env.DATABASE_URL, (err) => {
  if (!err) {
    console.log("Connected to mpongodb cluster");

    app.listen(process.env.PORT, (res) => {
      console.log(`Server is Running at port ${process.env.PORT}`);

      //Configuring Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_AIP_SECRET,
      });
    });
  }
});
