import { Router } from "express";
import { 
  GetAllUsers, 
  GetSingleUser, 
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

// Get single user
userRouter.get('/profile/:id', GetSingleUser);

export default userRouter;
