import { Router } from "express";
import upload from "../middlewares/multerMiddleWare.js";
import {
  ChangePassword,
  ChangeUserImg,
  DeleteUser,
  GetAllUsers,
  GetSingleUser,
  SearchUser,
  userLogin,
  userRegister,
  SendFriendRequest,
  RejectFriendRequest,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleWare.js";

const userRouter = Router();

// User register
userRouter.post("/register", userRegister);

// User login
userRouter.post("/login", userLogin);

// Get all users
userRouter.get("/all", GetAllUsers);

// Get single user
userRouter.get("/profile/:id", GetSingleUser);

// Change user password
userRouter.post("/:id/resetpassword", ChangePassword);

// Change user image
userRouter.post("/:id/image/change", upload.single("file"), ChangeUserImg);

// Delete user
userRouter.delete("/:id/delete", DeleteUser);

// Search user
userRouter.get("/", isAuth, SearchUser);

// Send friend request
userRouter.post("/sendrequest", isAuth, SendFriendRequest);

// Reject friend request
userRouter.post("/rejectrequest", isAuth, RejectFriendRequest);

export default userRouter;
