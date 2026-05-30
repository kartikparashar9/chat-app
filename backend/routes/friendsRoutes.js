const express = require("express");
const router = express.Router();

const { getFriends } = require("../controller/friendsController.js");
const { protect } = require("../middleware/jwtAuthMiddleware.js");

router.get("/", protect, getFriends);

module.exports = router;