const {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
} = require("../controllers/workerController");

const router = require("express").Router();

router.get("/", getWorkers);
router.get("/:id", getWorkerById);
router.post("/", createWorker);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);

module.exports = router;
