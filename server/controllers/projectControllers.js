const Project = require("../models/Project");
const Worker = require("../models/Worker");
const Resource = require("../models/Resources");

const { validateObjectId } = require("../utils/validation");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id })
      .populate("workers")
      .populate("resources");
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
    })
      .populate("workers")
      .populate("resources");
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
    const { name, description, workers, resources } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: false, msg: "Name of project not found" });
    }

    const workerIds = await Promise.all(
      workers.map(async (workerData) => {
        const worker = new Worker(workerData);
        await worker.save();
        return worker._id;
      })
    );

    const resourceIds = await Promise.all(
      resources.map(async (resourceData) => {
        const resource = new Resource(resourceData);
        await resource.save();
        return resource._id;
      })
    );

    const fudgeFactor = await generateFudgeFactor(req.params.projectId);
    const totalCost = await calculateTotalCost(workers, resources, fudgeFactor);

    const project = await Project.create({
      user: req.user.id,
      name,
      description,
      totalCost,
      workers: workerIds,
      resources: resourceIds,
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
    const { name, description, workers, resources } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ status: false, msg: "Name of project not found" });
    }

    if (!validateObjectId(req.params.projectId)) {
      return res
        .status(400)
        .json({ status: false, msg: "Project id not valid" });
    }

    const workerIds = await Promise.all(
      workers.map(async (workerData) => {
        const { id, name, manHours, payGrade } = workerData;
        if (validateObjectId(id)) {
          const existingWorker = await Worker.findById(id);
          if (existingWorker) {
            return existingWorker._id;
          }
        }
        const worker = new Worker({ name, manHours, payGrade });
        await worker.save();
        return worker._id;
      })
    );

    // Remove any undefined or null values from the array
    const filteredWorkerIds = workerIds.filter((id) => id);

    const resourceIds = await Promise.all(
      resources.map(async (resourceData) => {
        const { id, name, cost } = resourceData;
        if (validateObjectId(id)) {
          const existingResource = await Resource.findById(id);
          if (existingResource) {
            return existingResource._id;
          }
        }
        const resource = new Resource({ name, cost });
        await resource.save();
        return resource._id;
      })
    );

    // Remove any undefined or null values from the array
    const filteredResourceIds = resourceIds.filter((id) => id);

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

    const fudgeFactor = await generateFudgeFactor(req.params.projectId);
    const totalCost = await calculateTotalCost(workers, resources, fudgeFactor);

    project = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        name,
        description,
        totalCost,
        workers: filteredWorkerIds,
        resources: filteredResourceIds,
      },
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

    // Remove the workers related to the project
    const workerIds = project.workers;
    await Worker.deleteMany({ _id: { $in: workerIds } });

    // Remove the resources related to the project
    const resourceIds = project.resources;
    await Resource.deleteMany({ _id: { $in: resourceIds } });

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

const generateFudgeFactor = async (projectId) => {
  let fudgeFactor;
  // check if fudge factor has already been generated for project
  const project = await Project.findById(projectId);
  if (project && project.fudgeFactor) {
    fudgeFactor = project.fudgeFactor;
  } else {
    // generate new fudge factor between 0.5 and 1.5
    fudgeFactor = (Math.random() * (1 - 0.5) + 0.5).toFixed(2);
    // save fudge factor to project in database
    await Project.findByIdAndUpdate(projectId, { fudgeFactor });
  }
  return fudgeFactor;
};

const calculateTotalCost = async (workers, resources, fudgeFactor) => {
  let totalCost = 0;
  for (const worker of workers) {
    let hourlyRate;
    switch (worker.payGrade) {
      case "junior":
        hourlyRate = 10;
        break;
      case "standard":
        hourlyRate = 20;
        break;
      case "senior":
        hourlyRate = 30;
        break;
      default:
        hourlyRate = 0;
    }
    const cost = worker.manHours * hourlyRate;
    totalCost += cost;
  }
  for (const resource of resources) {
    totalCost += Number(resource.cost);
  }
  console.log(fudgeFactor);
  totalCost *= fudgeFactor;
  console.log(totalCost);
  return totalCost;
};
