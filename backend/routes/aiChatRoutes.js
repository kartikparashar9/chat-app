const express = require("express");
const { generate } = require("../controller/aiChatController");
const { protect } = require("../middleware/jwtAuthMiddleware");
const router = express.Router();

router.post("/chat-bot", protect, generate);

module.exports = router;