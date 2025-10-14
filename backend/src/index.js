import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import Message from "./models/Message.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

mongoose
  .connect("mongodb://127.0.0.1:27017/LiveTalk")
  .catch((error) => console.log(error));

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

const server = app.listen(port);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // Setup event: user joins their own room (for direct messaging)
  socket.on("setup", (userData) => {
    if (!userData || !userData._id) {
      return socket.emit("error", "Invalid user data");
    }
    socket.userId = userData._id;
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
  });

  // Typing indicator
  socket.on("typing", ({ room, user }) => {
    socket.to(room).emit("typing", { room, user });
  });

  // Stop typing indicator
  socket.on("stop typing", ({ room, user }) => {
    socket.to(room).emit("stop typing", { room, user });
  });

  // New message
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat || !chat.users) {
      return;
    }

    chat.users
      .filter(
        (u) => u._id.toString() !== newMessageReceived.sender._id.toString()
      )
      .forEach((u) => {
        socket.to(u._id).emit("message received", newMessageReceived);
      });
  });

  // Message seen/read event
  socket.on("message read", async ({ messageId, userId }) => {
    const message = await Message.findById(messageId);

    if (!message) return;

    // Prevent sender from being added
    if (message.sender.toString() === userId.toString()) {
      return;
    }

    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }

    await message.populate("readBy", "firstName lastName image");

    // Notify others in the chat
    socket.to(message.chat.toString()).emit("message read", message);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    if (socket.userId) {
      socket.leave(socket.userId);
    }
  });
});
