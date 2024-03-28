import { Router } from "express";
import { 
  GetAllUsers, 
  userLogin, 
  userRegister 
} from "../controllers/userController.js";

const userRouter = Router();

// User register
userRouter.post('/register', userRegister);

// User login
userRouter.post('/login', userLogin);

// Get all users
userRouter.get('/all', GetAllUsers);

export default userRouter;
