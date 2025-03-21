import { Router } from "express";
import {
  createChat,
  getChats,
  getSingleChat,
} from "../controllers/chatController.js";
import { isAuth } from "../middlewares/authMiddleWare.js";

const chatRouter = Router();

// Create a new chat
chatRouter.post("/", isAuth, createChat);

// Get all chats
chatRouter.get("/", isAuth, getChats);

// Get single chat
chatRouter.get("/:id", isAuth, getSingleChat);

export default chatRouter;
