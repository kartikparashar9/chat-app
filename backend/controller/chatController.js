const Chat = require("../models/chatModel.js");
const User = require("../models/userModel.js");

// ------------------ One to One Chat ------------------
const accessChats = async (req, res) => {
  try {
    const { userId } = req.body;

    //  validation
    if (!userId) {
      return res.status(400).json({
        message: "UserID required",
      });
    }

    //  find existing chat
    let isChat = await Chat.find({
      isGroupChat: false,
      users: {
        $all: [req.user._id, userId],
      },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    //  nested populate
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email avatar",
    });

    //  if chat exists
    if (isChat.length > 0) {
      return res.status(200).json(isChat[0]);
    }

    //  create new chat
    let createdChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    // populate users
    createdChat = await Chat.findById(createdChat._id).populate(
      "users",
      "-password"
    );

    return res.status(201).json(createdChat);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// ------------------ Fetch Chats ------------------
const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: {
        $in: [req.user._id],
      },
    })
      .populate("users", "name email avatar")
      .populate("groupAdmin", "name email avatar")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email avatar",
    });

    return res.status(200).json(chats);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ------------------ Create Group ------------------
 const createGroup = async (req, res) => {
  try {
    const {name, users} = req.body;

    if (!name || !users) {
      return res.status(400).json({
        message: "Name and Users required",
      });
    }

    let parsedUsers = JSON.parse(users);

    if (parsedUsers.length < 2) {
      return res.status(400).json({
        message: "At least 2 users required for group",
      });
    }

    // add current user
    parsedUsers.push(req.user._id);

    let groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    // populate
    groupChat = await Chat.findById(groupChat._id)
      .populate("users", "name email avatar")
      .populate("groupAdmin", "name email avatar");

    return res.status(201).json(groupChat);

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message
    });
  }
}

// ------------------ Rename Group ------------------
const renameGroup = async (req, res) => {
  try {
    const { chatId, name } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: name },
      { new: true }
    )
      .populate("users", "name email avatar")
      .populate("groupAdmin", "name email avatar");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json(updatedChat);

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ------------------ Add to Group ------------------
const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "name email avatar")
      .populate("groupAdmin", "name email avatar");

    return res.status(200).json(updatedChat);

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ------------------ Remove from Group ------------------
const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "name email avatar")
      .populate("groupAdmin", "name email avatar");

    return res.status(200).json(updatedChat);

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  accessChats,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup
};