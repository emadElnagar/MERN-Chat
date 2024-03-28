import { Router } from "express";
import { userLogin, userRegister } from "../controllers/userController.js";

const userRouter = Router();

// User register
userRouter.post('/register', userRegister);

// User login
userRouter.post('/login', userLogin);

export default userRouter;
