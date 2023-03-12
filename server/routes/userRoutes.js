const { register, login } = require("../controllers/userController.js");

const router = require("express").Router();

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", register);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", login);

module.exports = router;
