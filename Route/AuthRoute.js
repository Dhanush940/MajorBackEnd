const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
//
require("dotenv").config();
//
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  // console.log('sent by client - ', req.body);
  const { name, email, password, dob } = req.body;

  const user = new User({
    name,
    email,
    password,
    dob,
  });
  // console.log(user);
  const savedUser = await User.findOne({ email });
  if (savedUser) {
    console.log("already exists:", savedUser.email);
    return res.status(422).json({ error: "User already Exists " });
  }

  try {
    await user.save();
    console.log("User is ", user);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ message: "User Registered Successfully", token });
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  const savedUser = await User.findOne({ email: email });

  if (!savedUser) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }

  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        console.log("Password matched");
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        res.send({ token });
      } else {
        console.log("Password does not match");
        return res.status(422).json({ error: "Invalid Credentials" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
