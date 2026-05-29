const Conversation = require("../models/conversationModel");

// ---------------- GET MY CONVERSATIONS ----------------
const getMyConversations = async (
  req,
  res
) => {
  try {
    const conversations =
      await Conversation.find({
        members: req.user._id,
      })
        .populate(
          "members",
          "name username avatar isOnline"
        )
        .sort({ updatedAt: -1 });

    return res.status(200).json({
      conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getMyConversations,
};