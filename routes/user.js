const express = require("express");
const router = express.Router();

const User = require("../models/User.js");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

router.post("/user/signup", async (req, res) => {
  try {
    if (!req.body.username) {
      return res.status(400).json({ error: { message: "Username missing" } });
    }

    if (!req.body.email) {
      return res.status(400).json({ error: { message: "Email missing" } });
    }

    if (!req.body.password) {
      return res.status(400).json({ error: { message: "Password missing" } });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: { message: "Email already exist" } });
    }

    const password = req.body.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      token: token,
      hash: hash,
      salt: salt,
    });

    await newUser.save();

    const returnUser = {
      _id: newUser._id,
      token: newUser.token,
      username: newUser.username,
    };

    res.status(200).json(returnUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).json({ error: { message: "email or password missing" } });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: { message: "Unauthorized" } });
    }

    const returnUser = {
      _id: user._id,
      token: user.token,
      username: user.username,
    };
    res.status(200).json(returnUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
