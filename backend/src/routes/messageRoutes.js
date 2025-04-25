import { Router } from "express";
import { getMessages, NewMessage } from "../controllers/messageController.js";
import { isAuth } from "../middlewares/authMiddleWare.js";

const messageRouter = Router();

// Create a new message
messageRouter.post("/", isAuth, NewMessage);

// Get chat messages
messageRouter.get("/:id", isAuth, getMessages);

export default messageRouter;
