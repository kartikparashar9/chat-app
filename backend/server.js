const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiChatRoutes");

const socketHandler = require("./socket/socketHandler");

// ================= DB =================
connectDB();

const app = express();

const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

// SOCKET HANDLER
socketHandler(io);

// ================= EXPRESS =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/ai", aiRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {

  res.send("Server running...");

});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

});