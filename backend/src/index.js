import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
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
  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
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

  // Disconnect event
  socket.on("disconnect", () => {
    if (socket.userId) {
      socket.leave(socket.userId);
    }
  });
});
