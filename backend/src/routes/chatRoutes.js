import { Router } from "express";
import { createChat } from "../controllers/chatController.js";
import { isAuth } from "../middlewares/authMiddleWare.js";

const chatRouter = Router();

// Create a new chat
chatRouter.post("/", isAuth, createChat);

export default chatRouter;
