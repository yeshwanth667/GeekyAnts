const express = require("express");
const Assignment = require("../models/Assignment");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Fetching all assignments");
  const assignments = await Assignment.find();
  res.json(assignments);
});

router.post("/", async (req, res) => {
  console.log("Creating new assignment:", req.body);
  const assignment = new Assignment(req.body);
  await assignment.save();
  res.status(201).json(assignment);
});

router.put("/:id", async (req, res) => {
  console.log("Updating assignment ID:", req.params.id);
  const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  console.log("Deleting assignment ID:", req.params.id);
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: "Assignment deleted" });
});

module.exports = router;