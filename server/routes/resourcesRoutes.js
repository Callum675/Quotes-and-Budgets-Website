const {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController.js");

const router = require("express").Router();

router.get("/resources", getAllResources);
router.post("/resources", createResource);
router.put("/resources/:id", updateResource);
router.delete("/resources/:id", deleteResource);

module.exports = router;
