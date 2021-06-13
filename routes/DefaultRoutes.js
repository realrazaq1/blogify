const express = require("express");
const { requireAuth } = require("../utils/utils");
const DefaultController = require("../controllers/DefaultController");

const router = express.Router();

router.get("/", DefaultController.showHomePage);
router.get("/dashboard", requireAuth, DefaultController.showDashboard);
router.get("/profile/:user", requireAuth, DefaultController.showProfile);
router.post("/pp", DefaultController.uploadPP);

module.exports = router;
