const {
  createWorker,
  getAllWorkers,
  getWorkerById,
  putWorker,
  deleteWorker,
} = require("../controllers/workerController");

const router = require("express").Router();

// Create a new worker
router.post("/", createWorker);

// Get all workers
router.get("/", getAllWorkers);

// Get a specific worker by ID
router.get("/:id", getWorkerById);

// Update a specific worker by ID
router.put("/:id", putWorker);

// Delete a specific worker by ID
router.delete("/:id", deleteWorker);

module.exports = router;
