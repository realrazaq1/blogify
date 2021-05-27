const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

router.get("/login", AuthController.showLoginPage);
router.get("/register", AuthController.showRegPage);
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/logout", AuthController.logoutUser);

module.exports = router;
