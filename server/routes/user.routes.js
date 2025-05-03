const express = require("express");
const { userClerkController } = require("../controllers/user.controller");
const router = express.Router();

router.post("/clerk-user-webhook", userClerkController);

module.exports = router;
