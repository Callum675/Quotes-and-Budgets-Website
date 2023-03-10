const {
  create,
  readAll,
  readById,
  updateById,
  deleteById,
} = require("../controllers/projectController.js");

const router = require("express").Router();

router.post("/projects", create);
router.get("/projects", readAll);
router.get("/projects/:id", readById);
router.put("/projects/:id", updateById);
router.delete("/projects/:id", deleteById);

module.exports = router;
