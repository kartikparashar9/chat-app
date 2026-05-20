const express = require('express');

const {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
} = require('../controller/notificationController');

const { protect } = require('../middleware/jwtAuthMiddleware');

const router = express.Router();

router.get('/', protect, getNotifications);

router.put('/:messageId', protect, markNotificationRead);

router.put('/read/all', protect, markAllNotificationsRead);

router.delete('/:messageId', protect, deleteNotification);

module.exports = router;