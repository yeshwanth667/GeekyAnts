const express = require("express");
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Fetching all engineers");
  const engineers = await User.find({ role: "engineer" });
  res.json(engineers);
});

router.get("/:id/capacity", async (req, res) => {
  console.log("Fetching capacity for engineer ID:", req.params.id);
  const engineer = await User.findById(req.params.id);
  const assignments = await Assignment.find({ engineerId: engineer._id });
  const totalAllocated = assignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
  const available = engineer.maxCapacity - totalAllocated;
  console.log("Engineer capacity:", { allocated: totalAllocated, available });
  res.json({ allocated: totalAllocated, available });
});

// Update engineer profile
router.put("/:id", async (req, res) => {
  try {
    console.log("Updating engineer ID:", req.params.id);
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select(
      "-password"
    );
    if (!updated) return res.status(404).json({ message: "Engineer not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;