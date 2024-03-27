import { Router } from "express";
import { userRegister } from "../controllers/userController.js";

const userRouter = Router();

// User register
userRouter.post('/register', userRegister);

export default userRouter;
