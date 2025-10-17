const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ensure capitalized 'User'

module.exports = async function (req, res, next) {
    // Looks for 'Bearer TOKEN'
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        // Uses the correct JWT_SECRET from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};