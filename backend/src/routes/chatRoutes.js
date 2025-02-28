import { Router } from "express";
import { createChat } from "../controllers/chatController.js";

const chatRouter = Router();

// Create a new chat
chatRouter.post("/", createChat);

export default chatRouter;
