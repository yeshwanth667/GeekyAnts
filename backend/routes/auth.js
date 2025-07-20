const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    console.log("Invalid credentials for email:", email);
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  console.log("User authenticated:", user.email);
  res.json({ token, user });
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("JWT verified for user ID:", decoded.id);
    next();
  } catch (err) {
    console.log("Invalid token");
    res.status(403).json({ message: "Invalid token" });
  }
};

router.get("/profile", authenticate, async (req, res) => {
  console.log("Profile request for user ID:", req.user.id);
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = router;