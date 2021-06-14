const express = require("express");
const { requireAuth } = require("../utils/utils");
const ProfileController = require("../controllers/ProfileController");

const router = express.Router();

router.get("/:user", requireAuth, ProfileController.showProfile);
router.post("/upload_pp", ProfileController.uploadPP);
router.post("/update_pw", ProfileController.updatePassword);

module.exports = router;
