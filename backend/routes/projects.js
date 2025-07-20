const express = require("express");
const Project = require("../models/Project");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Fetching all projects");
  const projects = await Project.find();
  res.json(projects);
});

router.post("/", async (req, res) => {
  console.log("Creating new project:", req.body);
  const newProject = new Project(req.body);
  await newProject.save();
  res.status(201).json(newProject);
});

router.get("/:id", async (req, res) => {
  console.log("Fetching project ID:", req.params.id);
  const project = await Project.findById(req.params.id);
  res.json(project);
});

module.exports = router;