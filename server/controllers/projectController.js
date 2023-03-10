const Project = require("../models/projectModel.js");

// Create a new project
module.exports.create = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read all projects
module.exports.readAll = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read a specific project by ID
module.exports.readById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new Error("Project not found");
    res.status(200).json(project);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Update a specific project by ID
module.exports.updateById = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) throw new Error("Project not found");
    res.status(200).json(project);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Delete a specific project by ID
module.exports.deleteById = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) throw new Error("Project not found");
    res.status(200).json(project);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
