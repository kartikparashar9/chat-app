const express = require("express");

const router = express.Router();

const {
  sendMessage,
  allMessages,
  markAsSeen,
} = require("../controller/messageController.js");

const {
  protect,
} = require("../middleware/jwtAuthMiddleware.js");

// SEND MESSAGE
router.post(
  "/send",
  protect,
  sendMessage
);

// GET ALL MESSAGES
router.get(
  "/:conversationId",
  protect,
  allMessages
);

// MARK AS SEEN
router.put(
  "/seen",
  protect,
  markAsSeen
);

module.exports = router;