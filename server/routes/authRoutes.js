const { signup, login } = require("../controllers/authControllers");

const router = require("express").Router();

// Routes beginning with /api/auth
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
