const express = require("express");
const AuthController = require("../controllers/AuthController");
const { hideAuthRoutes } = require("../utils/utils");

const router = express.Router();

router.get("/login", hideAuthRoutes, AuthController.showLoginPage);
router.get("/register", hideAuthRoutes, AuthController.showRegPage);
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/logout", AuthController.logoutUser);

module.exports = router;
