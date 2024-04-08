import { Router } from "express";
import upload from "../middlewares/multerMiddleWare.js";
import { 
  ChangeUserImg,
  DeleteUser,
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

// Change user image
userRouter.post('/:id/image/change', upload.single('file'), ChangeUserImg);

// Delete user
userRouter.delete('/:id/delete', DeleteUser);

export default userRouter;
