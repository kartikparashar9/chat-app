const express = require("express");

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require("../controller/notificationController");

const { protect } = require("../middleware/jwtAuthMiddleware");

const router = express.Router();

// GET ALL NOTIFICATIONS
router.get("/", protect, getNotifications);

// MARK ALL READ
// router.put("/read/all", protect, markAllNotificationsRead);

// MARK SINGLE READ
// router.put("/:notificationId", protect, markNotificationRead);

// DELETE NOTIFICATION
router.delete("/:notificationId", protect, deleteNotification);

module.exports = router;