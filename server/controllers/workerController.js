const Worker = require("../models/workerModel.js");

// Get all workers
module.exports.getWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find();
    res.status(200).json({ success: true, data: workers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get worker by id
module.exports.getWorkerById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    }
    res.status(200).json({ success: true, data: worker });
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
};

// Create a new worker
module.exports.createWorker = async (req, res, next) => {
  try {
    const { name, hourlyRate, payGrade } = req.body;
    const worker = await Worker.create({ name, hourlyRate, payGrade });
    res.status(201).json({ success: true, data: worker });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a worker
module.exports.updateWorker = async (req, res, next) => {
  try {
    const { name, hourlyRate, payGrade } = req.body;
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { name, hourlyRate, payGrade },
      { new: true, runValidators: true }
    );
    if (!worker) {
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    }
    res.status(200).json({ success: true, data: worker });
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
};

// Delete a worker
module.exports.deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) {
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
};
