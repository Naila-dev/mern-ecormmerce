// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Use capitalized model name

// @route POST /api/auth/register
// @desc Register a new user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // The pre-save hook in the User model handles password hashing
        const newUser = new User({ username, password });
        await newUser.save(); 

        // Generate token using the model method
        const token = newUser.getSignedJwtToken();
        
        res.status(201).json({ 
            success: true,
            message: "User registered successfully", 
            token 
        });
    } catch (err) {
        let errorMsg = "Registration failed";
        // Handle duplicate key error (username unique constraint)
        if (err.code === 11000) {
            errorMsg = "Username already exists";
            return res.status(400).json({ success: false, error: errorMsg });
        }
        res.status(500).json({ success: false, error: "Server Error: " + err.message });
    }
});

// @route POST /api/auth/login
// @desc Log in user & get token
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find user, explicitly selecting the password field
        const user = await User.findOne({ username }).select('+password'); 
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        // 2. Compare password using the model method
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        // 3. Generate token
        const token = user.getSignedJwtToken();

        res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            token 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "Login failed" });
    }
});

module.exports = router;