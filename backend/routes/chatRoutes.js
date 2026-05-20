const express = require("express");

const {
  accessChats,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controller/chatController.js");

const { protect } = require("../middleware/jwtAuthMiddleware.js");

const router = express.Router();

// One-to-One Chat
router.post("/", protect, accessChats);

// Get all chats
router.get("/", protect, fetchChats);

// Group Chat Routes
router.post("/group", protect, createGroup);
router.put("/group/rename", protect, renameGroup);
router.put("/group/add", protect, addToGroup);
router.put("/group/remove", protect, removeFromGroup);

module.exports = router;