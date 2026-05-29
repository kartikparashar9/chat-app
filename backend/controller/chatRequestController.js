const ChatRequest = require("../models/chatRequestModel");
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");

// ---------------- SEND REQUEST ----------------
const sendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    // VALIDATION
    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }

    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        message: "You cannot send request to yourself",
      });
    }

    // CHECK RECEIVER EXISTS
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    // CHECK ALREADY CONNECTED
    const sender = await User.findById(senderId);

    if (
      sender.connections.includes(receiverId)
    ) {
      return res.status(400).json({
        message: "Already connected",
      });
    }

    // CHECK EXISTING REQUEST
    const existingRequest =
      await ChatRequest.findOne({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
      });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    // CREATE REQUEST
    const request = await ChatRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    return res.status(201).json({
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------- ACCEPT REQUEST ----------------
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        message: "Request ID is required",
      });
    }

    const request = await ChatRequest.findById(
      requestId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // ONLY RECEIVER CAN ACCEPT
    if (
      request.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already handled",
      });
    }

    request.status = "accepted";

    await request.save();

    // ADD CONNECTIONS BOTH SIDES
    await User.findByIdAndUpdate(
      request.sender,
      {
        $push: {
          connections: request.receiver,
        },
      }
    );

    await User.findByIdAndUpdate(
      request.receiver,
      {
        $push: {
          connections: request.sender,
        },
      }
    );

    // CREATE CONVERSATION
    const existingConversation =
      await Conversation.findOne({
        members: {
          $all: [
            request.sender,
            request.receiver,
          ],
        },
      });

    if (!existingConversation) {
      await Conversation.create({
        members: [
          request.sender,
          request.receiver,
        ],
      });
    }

    return res.status(200).json({
      message: "Request accepted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------- REJECT REQUEST ----------------
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await ChatRequest.findById(
      requestId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    request.status = "rejected";

    await request.save();

    return res.status(200).json({
      message: "Request rejected",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ---------------- GET PENDING REQUESTS ----------------
const getPendingRequests = async (
  req,
  res
) => {
  try {
    const requests = await ChatRequest.find({
      receiver: req.user._id,
      status: "pending",
    })
      .populate(
        "sender",
        "name username avatar"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getPendingRequests,
};