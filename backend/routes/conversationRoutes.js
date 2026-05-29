const express = require("express");

const router = express.Router();

const {
  getMyConversations,
} = require("../controller/conversationController.js");

const {
  protect,
} = require("../middleware/jwtAuthMiddleware.js");

// GET MY CONVERSATIONS
router.get(
  "/my-conversations",
  protect,
  getMyConversations
);

module.exports = router;