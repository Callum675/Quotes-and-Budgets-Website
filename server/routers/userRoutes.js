const express = require("express");
const { validateCredentials, userAuth } = require("../middleware/userAuth.js");
const controller = require("../controllers/userController.js");

const router = express.Router();

// Unauthenticated
router.post("/signup", validateCredentials, controller.signUp);
router.post("/signin", validateCredentials, controller.signIn);

// Authenticated
router.get("/signout", userAuth, controller.signOut);
router.post("/password", userAuth, controller.changePassword);
router.delete("/", userAuth, controller.deleteUser);
router.get("/saved", userAuth, controller.getLocationsAndVideos);

module.exports = router;