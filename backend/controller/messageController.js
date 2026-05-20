const Message = require("../models/messageModel.js");
const User = require("../models/userModel.js");
const Chat = require("../models/chatModel.js");

// ------------------ Send Message ------------------
const sendMessage = async (req, res) => {
  try {
    const { content, chatId, messageType = "text" } = req.body;

    if (!content || !chatId) {
      return res.status(400).json({ message: "Content and ChatId required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isMember = chat.users.some(
      (u) => u.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Not a member of this chat" });
    }

    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
      messageType,
    });

    message = await Message.findById(message._id)
      .populate("sender", "name email avatar")
      .populate({
        path: "chat",
        populate: { path: "users", select: "name email avatar" }
      });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    const io = req.app.get("io");
    if (io && message.chat?.users) {
      message.chat.users.forEach((user) => {
        if (user._id.toString() === req.user._id.toString()) return;
        io.to(user._id.toString()).emit("message received", message);
      });
    }

    return res.status(201).json(message);

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ------------------ Get All Messages ------------------
const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip  = (page - 1) * limit;

    // verify chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // verify membership
    const isMember = chat.users.some(
      (u) => u.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Not a member of this chat" });
    }

    const messages = await Message.find({
      chat: chatId,
      isDeleted: false    
    })
      .populate("sender", "name email avatar")
      .populate("chat")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json(messages);

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ------------------ Mark as Seen ------------------
const markAsSeen = async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!chatId) { 
      return res.status(400).json({ message: "ChatId is required" });
    }

    await Message.updateMany(
      { chat: chatId, seenBy: { $ne: req.user._id } },
      { $push: { seenBy: req.user._id } }
    );

    // notify others in real-time
    const io = req.app.get("io");
    if (io) {
      io.to(chatId).emit("messages seen", {
        chatId,
        seenBy: req.user._id
      });
    }

    return res.status(200).json({ message: "Messages marked as seen" });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = { sendMessage, allMessages, markAsSeen };