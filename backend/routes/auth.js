// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// @route POST /simple-ecom/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, error: "Username and password are required" });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ success: false, error: "Username already exists" });

    const newUser = new User({ username, password });
    await newUser.save();

    const token = newUser.getSignedJwtToken();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error: " + err.message });
  }
});

// @route POST /simple-ecom/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ msg: "Username and password are required" });

    // Need to explicitly select password because the schema excludes it by default
    const user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    // Prefer the model method which compares hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      // Clear message to help with local dev misconfiguration
      return res.status(500).json({ msg: "Server misconfiguration: JWT_SECRET not set" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "1d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server Error: " + err.message });
  }
});

module.exports = router;
