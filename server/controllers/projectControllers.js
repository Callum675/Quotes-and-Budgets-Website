// Imports the necessary models and validation functions
const Project = require('../models/Project');
const Worker = require('../models/Worker');
const Resource = require('../models/Resources');
const { validateObjectId } = require('../utils/validation');

// This function gets all projects associated with the logged in user
exports.getProjects = async (req, res) => {
  try {
    // Find all projects that belong to the logged in user, and populate the workers and resources fields
    const projects = await Project.find({ user: req.user.id }).populate('workers').populate('resources');
    // Return the projects in JSON format with a success message and status code 200
    res.status(200).json({ projects, status: true, msg: 'Projects found successfully..' });
  } catch (err) {
    // If there is an error, log it and return an error message with status code 500
    console.error(err);
    return res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};

// This function gets a single project associated with the logged in user, given a project ID
exports.getProject = async (req, res) => {
  try {
    // If the project ID is not valid, return an error message with status code 400
    if (!validateObjectId(req.params.projectId)) {
      return res.status(400).json({ status: false, msg: 'Project id not valid' });
    }

    // Find the project that belongs to the logged in user and has the given project ID, and populate the workers and resources fields
    const project = await Project.findOne({
      user: req.user.id,
      _id: req.params.projectId,
    })
      .populate('workers')
      .populate('resources');

    // If no project is found, return an error message with status code 400
    if (!project) {
      return res.status(400).json({ status: false, msg: 'No project found..' });
    }
    // Return the project in JSON format with a success message and status code 200
    res.status(200).json({ project, status: true, msg: 'Project found successfully..' });
  } catch (err) {
    // If there is an error, log it and return an error message with status code 500
    console.error(err);
    return res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};

exports.postProject = async (req, res) => {
  try {
    const { name, description, workers, resources } = req.body;

    if (!name) {
      return res.status(400).json({ status: false, msg: 'Name of project not found' });
    }

    /* Creating a new worker for each worker in the workers array and saving it to the database. It
    then returns the id of the worker. */
    const workerIds = await Promise.all(
      workers.map(async (workerData) => {
        const worker = new Worker(workerData);
        await worker.save();
        return worker._id;
      }),
    );

    /* Creating a new resource for each resource in the resources array and saving it to the database.
    It then returns the id of the resource. */
    const resourceIds = await Promise.all(
      resources.map(async (resourceData) => {
        const resource = new Resource(resourceData);
        await resource.save();
        return resource._id;
      }),
    );

    /* Generating a random number between 0.5 and 1.5 and then multiplying the total cost by that number. */
    const fudgeFactor = await generateFudgeFactor(req.params.projectId);
    const totalCost = await calculateTotalCost(workers, resources, fudgeFactor);

    /* Creating a new project and saving it to the database. */
    const project = await Project.create({
      user: req.user.id,
      name,
      description,
      totalCost,
      workers: workerIds,
      resources: resourceIds,
    });
    res.status(200).json({ project, status: true, msg: 'Project created successfully..' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};

exports.putProject = async (req, res) => {
  try {
    const { name, description, workers, resources } = req.body;
    /* This is checking if the name of the project is not empty. If it is empty, it will return a 400
   status code with a message saying that the name of the project was not found. */
    if (!name) {
      return res.status(400).json({ status: false, msg: 'Name of project not found' });
    }

    /* This is checking if the id of the project is valid. If it is not valid, it will return a 400
    status code with a message saying that the id of the project is not valid. */
    if (!validateObjectId(req.params.projectId)) {
      return res.status(400).json({ status: false, msg: 'Project id not valid' });
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
      }),
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
      }),
    );

    // Remove any undefined or null values from the array
    const filteredResourceIds = resourceIds.filter((id) => id);

    let project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(400).json({ status: false, msg: 'Project with given id not found' });
    }

    if (project.user != req.user.id) {
      return res.status(403).json({
        status: false,
        msg: "You can't update project of another user",
      });
    }

    /* Generating a random number between 0.5 and 1.5 and then multiplying the total cost by that number. */
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
      { new: true },
    );
    res.status(200).json({ project, status: true, msg: 'Project updated successfully..' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};

exports.putProjects = async (req, res) => {
  try {
    const projectIds = req.body.projects;

    // Get the projects to be combined
    const projects = await Project.find({ _id: { $in: projectIds } });

    // Check if all projects exist
    if (projects.length !== projectIds.length) {
      return res.status(404).json({ status: false, msg: 'Project not found' });
    }

    // Combine the workers and resources arrays of the projects and calculate the new total cost
    let workers = [];
    let resources = [];
    let totalCost = 0;

    projects.forEach((project) => {
      workers = [...workers, ...project.workers];
      resources = [...resources, ...project.resources];
      totalCost += project.totalCost;
    });

    // Create a new project with the combined data
    const combinedProject = new Project({
      user: req.user.id,
      name: projects.map((project) => project.name).join(' & '),
      description: projects.map((project) => project.description).join(' & '),
      workers,
      resources,
      totalCost,
    });

    // Save the new project to the database
    const savedProject = await combinedProject.save();

    res.status(200).json({
      projectId: savedProject._id,
      status: true,
      msg: 'Projects combined successfully',
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: 'Internal server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    /* This is checking if the id of the project is valid. If it is not valid, it will return a 400
        status code with a message saying that the id of the project is not valid. */
    if (!validateObjectId(req.params.projectId)) {
      return res.status(400).json({ status: false, msg: 'Project id not valid' });
    }

    /* This is checking if the project exists. If it does not exist, it will return a 400 status code
    with a message saying that the project with the given id was not found. */
    let project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(400).json({ status: false, msg: 'Project with given id not found' });
    }

    /* This is checking if the user is the owner of the project. If the user is not the owner of the
    project, it will return a 403 status code with a message saying that the user cannot delete the
    project of another user. */
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
    res.status(200).json({ status: true, msg: 'Project deleted successfully..' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};

/**
 * It generates a random number between 0.5 and 1.5, saves it to the database, and returns it.
 * @param projectId - the id of the project
 * @returns The fudgeFactor is being returned.
 */
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

/**
 * It takes in an array of workers, an array of resources, and a fudge factor, and returns the total
 * cost of the project
 * @param workers - an array of objects, each object has a payGrade property and a manHours property
 * @param resources - an array of objects, each object has a cost property
 * @param fudgeFactor - a number between 0 and 1 that is used to fudge the total cost.
 * @returns The total cost of the project.
 */
const calculateTotalCost = async (workers, resources, fudgeFactor) => {
  let totalCost = 0;
  for (const worker of workers) {
    let hourlyRate;
    switch (worker.payGrade) {
      case 'junior':
        hourlyRate = 10;
        break;
      case 'standard':
        hourlyRate = 20;
        break;
      case 'senior':
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
  totalCost *= fudgeFactor;
  totalCost = totalCost.toFixed(2);
  return totalCost;
};
