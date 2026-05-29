const express = require("express");

const router = express.Router();

const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getPendingRequests,
} = require("../controller/chatRequestController.js");

const {
  protect,
} = require("../middleware/jwtAuthMiddleware.js");

// SEND REQUEST
router.post(
  "/send",
  protect,
  sendRequest
);

// ACCEPT REQUEST
router.post(
  "/accept",
  protect,
  acceptRequest
);

// REJECT REQUEST
router.post(
  "/reject",
  protect,
  rejectRequest
);

// GET PENDING REQUESTS
router.get(
  "/pending",
  protect,
  getPendingRequests
);

module.exports = router;