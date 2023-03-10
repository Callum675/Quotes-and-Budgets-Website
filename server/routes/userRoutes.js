const { register, login } = require("../controllers/userController.js");
const { checkUser } = require("../middleware/auth.js");

const router = require("express").Router();

router.post("/", checkUser);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
