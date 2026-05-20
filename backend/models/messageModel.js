const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      trim: true,
      require: function () {
        return this.messageType != "text";
      }
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio"],
      default: "text"
    },

    mediaUrl: {
      type: String,
      required: function () {
        return this.messageType !== "text";
      }
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },

    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);