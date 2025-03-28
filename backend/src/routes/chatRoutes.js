import { Router } from "express";
import {
  createChat,
  getChats,
  getSingleChat,
  renameChat,
  addUserToChat,
  removeUserFromChat,
} from "../controllers/chatController.js";
import { isAuth } from "../middlewares/authMiddleWare.js";

const chatRouter = Router();

// Create a new chat
chatRouter.post("/", isAuth, createChat);

// Get all chats
chatRouter.get("/", isAuth, getChats);

// Get single chat
chatRouter.get("/:id", isAuth, getSingleChat);

// Rename chat
chatRouter.patch("/:id", isAuth, renameChat);

// Add user to chat
chatRouter.patch("/:id/addUser", isAuth, addUserToChat);

// Remove user from chat
chatRouter.patch("/:id/removeUser", isAuth, removeUserFromChat);

export default chatRouter;
