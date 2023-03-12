const Worker = require("../models/worker");

// Create a new worker
exports.createWorker = async (req, res) => {
  try {
    const newWorker = new Worker({
      name: req.body.name,
      payGrade: req.body.payGrade,
      manHours: req.body.manHours,
    });
    const savedWorker = await newWorker.save();
    res.status(201).json(savedWorker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all workers
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific worker by ID
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (worker == null) {
      return res.status(404).json({ message: "Cannot find worker" });
    }
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a specific worker by ID
exports.putWorker = async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        payGrade: req.body.payGrade,
        manHours: req.body.manHours,
      },
      { new: true }
    );
    if (updatedWorker == null) {
      return res.status(404).json({ status: false, msg: "Cannot find worker" });
    }
    res.json(updatedWorker);
  } catch (err) {
    res.status(400).json({ status: false, msg: err.message });
  }
};

// Delete a specific worker by ID
exports.deleteWorker = async (req, res) => {
  try {
    const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
    if (deletedWorker == null) {
      return res.status(404).json({ status: false, msg: "Cannot find worker" });
    }
    res
      .status(200)
      .json({ status: true, msg: "Worker deleted successfully.." });
  } catch (err) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
