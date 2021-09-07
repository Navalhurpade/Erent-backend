const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const slatingRounds = 10;
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const upload = require("../utils/multerUploader");

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

//Register New User !
router.post("/register", upload.single("profile_pic"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // making Case insensitive
    const userEmail = email.toLowerCase().trim();
    const userName = capitalizeFirstLetter(name).trim();

    const foundUser = await User.findOne({ email: email });

    if (foundUser) {
      res.status(409).send({ error: "User exist" });
      return;
    }

    const hashedPass = await bcrypt.hash(password, slatingRounds);

    let optionalData = {};
    console.log(req.file, req.body);

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(
        `uploads/${req.file.filename}`
      );
      optionalData.profile_pic = uploadedImage.url;

      //Deliting unessary files !
      fs.unlinkSync(`uploads/${req.file.filename}`);
    }

    const newUser = new User({
      email: userEmail,
      name: userName,
      password: hashedPass,
      role: role,
      ...optionalData,
    });

    await newUser.save();

    res.status(201).send({ ok: "Registerded new user " });
    console.log("Registered New user !");

    return;
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email: email });

    if (!foundUser)
      return res.status(400).send({ error: "invalid email or password" });

    const match = bcrypt.compare(password, foundUser.password);

    if (!match)
      return res.status(400).send({ error: "invalid email or password" });

    const token = jwt.sign(
      {
        _id: foundUser._id,
        name: foundUser.name,
        role: foundUser.role,
        email: foundUser.email,
        profile_pic: foundUser.profile_pic,
      },
      process.env.APP_SECRET
    );

    return res.status(200).send(token);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
