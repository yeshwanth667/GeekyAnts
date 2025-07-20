const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create user manually via Postman
router.post("/", async (req, res) => {
  try {
    const newUser = await User.insertMany(req.body);
    // await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("User insert error:", err);
    res.status(400).json({ message: "Insert failed", error: err.message });
  }
});

module.exports = router;
