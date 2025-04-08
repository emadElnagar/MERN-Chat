import { Router } from "express";
import { NewMessage } from "../controllers/messageController.js";
import { isAuth } from "../middlewares/authMiddleWare.js";

const messageRouter = Router();

// Create a new message
messageRouter.post("/", isAuth, NewMessage);

export default messageRouter;
