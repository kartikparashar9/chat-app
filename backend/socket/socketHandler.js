const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

// ================= MULTI TAB TRACKING =================
const onlineUsers = new Map();

const socketHandler = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // ==================================================
    // AUTH + SETUP
    // ==================================================

    socket.on("setup", async (token) => {

      try {

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );

        const userId = decoded.id;

        socket.userId = userId;

        socket.join(userId);

        const count =
          onlineUsers.get(userId) || 0;

        onlineUsers.set(userId, count + 1);

        // FIRST TAB OPENED

        if (count === 0) {

          await User.findByIdAndUpdate(userId, {
            isOnline: true,
          });

          io.emit("user status", {
            userId,
            isOnline: true,
          });

        }

        socket.emit("connected");

      } catch (err) {

        console.log(
          "Socket Auth Error:",
          err.message
        );

      }

    });

    // ==================================================
    // JOIN CHAT
    // ==================================================

    socket.on("join chat", (chatId) => {

      socket.join(chatId);

    });

    // ==================================================
    // LEAVE CHAT
    // ==================================================

    socket.on("leave chat", (chatId) => {

      socket.leave(chatId);

    });

    // ==================================================
    // TYPING
    // ==================================================

    socket.on("typing", (chatId) => {

      socket.to(chatId).emit("typing", {
        chatId,
        userId: socket.userId,
      });

    });

    // ==================================================
    // STOP TYPING
    // ==================================================

    socket.on("stop typing", (chatId) => {

      socket.to(chatId).emit("stop typing", {
        chatId,
        userId: socket.userId,
      });

    });

    // ==================================================
    // NEW MESSAGE
    // ==================================================

    socket.on("new message", (newMessage) => {

      const chat = newMessage.chat;

      if (!chat.users) return;

      chat.users.forEach((user) => {

        if (
          user._id == newMessage.sender._id
        ) {
          return;
        }

        socket.to(user._id).emit(
          "message received",
          newMessage
        );

        socket.to(user._id).emit(
          "notification received",
          {
            chatId: chat._id,
            message: newMessage,
          }
        );

      });

    });

    // ==================================================
    // MESSAGE SEEN
    // ==================================================

    socket.on(
      "message seen",
      async (chatId) => {

        try {

          await Message.updateMany(
            {
              chat: chatId,
              seenBy: {
                $ne: socket.userId,
              },
            },
            {
              $addToSet: {
                seenBy: socket.userId,
              },
            }
          );

          socket.to(chatId).emit(
            "message seen update",
            {
              chatId,
              userId: socket.userId,
            }
          );

        } catch (err) {

          console.log(
            "Seen Error:",
            err.message
          );

        }

      }
    );

    // ==================================================
    // ================= WEBRTC =========================
    // ==================================================

    // CALL USER

    socket.on(
      "call-user",
      ({ to, offer }) => {

        io.to(to).emit(
          "incoming-call",
          {
            from: socket.userId,
            offer,
          }
        );

      }
    );

    // ACCEPT CALL

    socket.on(
      "accept-call",
      ({ to, answer }) => {

        io.to(to).emit(
          "call-accepted",
          {
            answer,
          }
        );

      }
    );

    // REJECT CALL

    socket.on(
      "reject-call",
      ({ to }) => {

        io.to(to).emit(
          "call-rejected"
        );

      }
    );

    // ICE CANDIDATES

    socket.on(
      "ice-candidate",
      ({ to, candidate }) => {

        io.to(to).emit(
          "ice-candidate",
          {
            candidate,
          }
        );

      }
    );

    // END CALL

    socket.on(
      "end-call",
      ({ to }) => {

        io.to(to).emit(
          "call-ended"
        );

      }
    );

    // ==================================================
    // DISCONNECT
    // ==================================================

    socket.on(
      "disconnect",
      async () => {

        try {

          const userId = socket.userId;

          if (!userId) return;

          const count =
            onlineUsers.get(userId) || 1;

          // LAST TAB CLOSED

          if (count === 1) {

            onlineUsers.delete(userId);

            await User.findByIdAndUpdate(
              userId,
              {
                isOnline: false,
                lastSeen: new Date(),
              }
            );

            io.emit("user status", {
              userId,
              isOnline: false,
            });

          } else {

            onlineUsers.set(
              userId,
              count - 1
            );

          }

          console.log(
            "User disconnected:",
            userId
          );

        } catch (err) {

          console.log(
            "Disconnect Error:",
            err.message
          );

        }

      }
    );

  });

};

module.exports = socketHandler;