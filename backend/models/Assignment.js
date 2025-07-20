const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  engineerId: mongoose.Types.ObjectId,
  projectId: mongoose.Types.ObjectId,
  allocationPercentage: Number,
  startDate: Date,
  endDate: Date,
  role: String,
});

module.exports = mongoose.model("Assignment", assignmentSchema);