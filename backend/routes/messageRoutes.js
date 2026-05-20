const express = require('express');

const {
    sendMessage,
    allMessages,
    markAsSeen
} = require('../controller/messageController');

const { protect } = require('../middleware/jwtAuthMiddleware');

const router = express.Router();

// SEND MESSAGE
router.post("/", protect, sendMessage);


// GET ALL MESSAGES OF CHAT
router.get("/:chatId", protect, allMessages);


// MARK MESSAGE AS SEEN
router.put("/seen/:messageId", protect, markAsSeen);


module.exports = router;