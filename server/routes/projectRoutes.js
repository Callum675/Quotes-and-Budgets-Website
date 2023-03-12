const {
  getProjects,
  getProject,
  postProject,
  putProject,
  deleteProject,
} = require("../controllers/projectControllers");
const { verifyAccessToken } = require("../middleware/auth.js");

const router = require("express").Router();

// Routes beginning with /api/projects
router.get("/", verifyAccessToken, getProjects);
router.get("/:projectId", verifyAccessToken, getProject);
router.post("/", verifyAccessToken, postProject);
router.put("/:projectId", verifyAccessToken, putProject);
router.delete("/:projectId", verifyAccessToken, deleteProject);

module.exports = router;
