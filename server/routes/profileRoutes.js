const { getProfile } = require("../controllers/profileControllers");
const { verifyAccessToken } = require("../middleware/auth.js");

const router = require("express").Router();

// Routes beginning with /api/profile
router.get("/", verifyAccessToken, getProfile);

module.exports = router;
