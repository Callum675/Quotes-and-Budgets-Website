const Project = require("../models/Project");
const Worker = require("../models/Worker");
const { validateObjectId } = require("../utils/validation");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res
      .status(200)
      .json({ projects, status: true, msg: "Projects found successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.getProject = async (req, res) => {
  try {
    if (!validateObjectId(req.params.projectId)) {
      return res
        .status(400)
        .json({ status: false, msg: "Project id not valid" });
    }

    const project = await Project.findOne({
      user: req.user.id,
      _id: req.params.projectId,
    });
    if (!project) {
      return res.status(400).json({ status: false, msg: "No project found.." });
    }
    res
      .status(200)
      .json({ project, status: true, msg: "Project found successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.postProject = async (req, res) => {
  try {
    console.log(req.body);
    const { description, workers, totalCost } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ status: false, msg: "Description of project not found" });
    }

    const workerIds = await Promise.all(
      workers.map(async (workerData) => {
        const worker = new Worker(workerData);
        await worker.save();
        return worker._id;
      })
    );

    const project = await Project.create({
      user: req.user.id,
      description,
      totalCost,
      workers: workerIds,
    });
    res
      .status(200)
      .json({ project, status: true, msg: "Project created successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.putProject = async (req, res) => {
  try {
    console.log(req.body);
    const { description } = req.body;
    if (!description) {
      return res
        .status(400)
        .json({ status: false, msg: "Description of project not found" });
    }

    if (!validateObjectId(req.params.projectId)) {
      return res
        .status(400)
        .json({ status: false, msg: "Project id not valid" });
    }

    let project = await Project.findById(req.params.projectId);
    if (!project) {
      return res
        .status(400)
        .json({ status: false, msg: "Project with given id not found" });
    }

    if (project.user != req.user.id) {
      return res.status(403).json({
        status: false,
        msg: "You can't update project of another user",
      });
    }

    project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { description },
      { new: true }
    );
    res
      .status(200)
      .json({ project, status: true, msg: "Project updated successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    if (!validateObjectId(req.params.projectId)) {
      return res
        .status(400)
        .json({ status: false, msg: "Project id not valid" });
    }

    let project = await Project.findById(req.params.projectId);
    if (!project) {
      return res
        .status(400)
        .json({ status: false, msg: "Project with given id not found" });
    }

    if (project.user != req.user.id) {
      return res.status(403).json({
        status: false,
        msg: "You can't delete project of another user",
      });
    }

    await Project.findByIdAndDelete(req.params.projectId);
    res
      .status(200)
      .json({ status: true, msg: "Project deleted successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
