const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

// GET ALL NOTIFICATIONS OF USER
const getNotifications = async (req, res) => {
    try {

        const userId = req.user._id;

        const notifications = await Message.find({
            receiver: userId,
            isNotificationRead: false
        })
        .populate("sender", "name email profilePic")
        .populate("chat")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// MARK SINGLE NOTIFICATION AS READ
const markNotificationRead = async (req, res) => {
    try {

        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        message.isNotificationRead = true;

        await message.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// MARK ALL NOTIFICATIONS AS READ
const markAllNotificationsRead = async (req, res) => {
    try {

        const userId = req.user._id;

        await Message.updateMany(
            {
                receiver: userId,
                isNotificationRead: false
            },
            {
                $set: {
                    isNotificationRead: true
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
    try {

        const { messageId } = req.params;

        const deletedNotification = await Message.findByIdAndDelete(messageId);

        if (!deletedNotification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
};