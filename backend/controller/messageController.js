const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");

// ---------------- SEND MESSAGE ----------------
const sendMessage = async (req, res) => {
  try {
    const {
      content,
      conversationId,
      messageType = "text",
    } = req.body;

    // VALIDATION
    if (!content || !conversationId) {
      return res.status(400).json({
        message:
          "Content and Conversation ID are required",
      });
    }

    // CHECK CONVERSATION EXISTS
    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // CHECK USER IS MEMBER
    const isMember =
      conversation.members.some(
        (member) =>
          member.toString() ===
          req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        message:
          "You are not part of this conversation",
      });
    }

    // CREATE MESSAGE
    let message = await Message.create({
      sender: req.user._id,
      content,
      conversation: conversationId,
      messageType,
    });

    // POPULATE
    message = await Message.findById(
      message._id
    )
      .populate(
        "sender",
        "name username avatar"
      )
      .populate({
        path: "conversation",
        populate: {
          path: "members",
          select:
            "name username avatar isOnline",
        },
      });

    // UPDATE LAST MESSAGE
    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: content,
      }
    );

    // SOCKET.IO
    const io = req.app.get("io");

    if (
      io &&
      message.conversation?.members
    ) {
      message.conversation.members.forEach(
        (member) => {
          if (
            member._id.toString() ===
            req.user._id.toString()
          )
            return;

          io.to(member._id.toString()).emit(
            "message received",
            message
          );
        }
      );
    }

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------- GET ALL MESSAGES ----------------
const allMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 50;

    const skip = (page - 1) * limit;

    // CHECK CONVERSATION
    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // CHECK MEMBER
    const isMember =
      conversation.members.some(
        (member) =>
          member.toString() ===
          req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        message:
          "You are not part of this conversation",
      });
    }

    // FETCH MESSAGES
    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate(
        "sender",
        "name username avatar"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------- MARK AS SEEN ----------------
const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        message:
          "Conversation ID is required",
      });
    }

    await Message.updateMany(
      {
        conversation: conversationId,
        seenBy: {
          $ne: req.user._id,
        },
      },
      {
        $push: {
          seenBy: req.user._id,
        },
      }
    );

    // SOCKET EVENT
    const io = req.app.get("io");

    if (io) {
      io.to(conversationId).emit(
        "messages seen",
        {
          conversationId,
          seenBy: req.user._id,
        }
      );
    }

    return res.status(200).json({
      message:
        "Messages marked as seen",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  allMessages,
  markAsSeen,
};