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
  AcceptFriendRequest,
  CancelFriendRequest,
  GetFriends,
  RemoveFriend,
  GetMe,
  userLogout,
} from "../controllers/userController.js";
import {
  ChangePasswordValidation,
  signupValidation,
} from "../validations/userValidations.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleWare.js";

const userRouter = Router();

// User register
userRouter.post("/register", signupValidation, userRegister);

// User login
userRouter.post("/login", userLogin);

// User logout
userRouter.post("/logout", userLogout);

// Get all users
userRouter.get("/all", GetAllUsers);

// Get single user
userRouter.get("/profile/:id", GetSingleUser);

// Get me (current user)
userRouter.get("/me", isAuth, GetMe);

// Change user password
userRouter.post("/:id/resetpassword", ChangePasswordValidation, ChangePassword);

// Change user image
userRouter.post(
  "/:id/image/change",
  isAuth,
  upload.single("file"),
  ChangeUserImg
);

// Delete user
userRouter.delete("/:id/delete", isAuth, isAdmin, DeleteUser);

// Search user
userRouter.get("/", isAuth, SearchUser);

// Send friend request
userRouter.post("/sendrequest", isAuth, SendFriendRequest);

// Cancel friend request
userRouter.post("/cancelrequest", isAuth, CancelFriendRequest);

// Reject friend request
userRouter.post("/rejectrequest", isAuth, RejectFriendRequest);

// Accept friend request
userRouter.post("/acceptrequest", isAuth, AcceptFriendRequest);

// Get friends
userRouter.get("/friends", isAuth, GetFriends);

// Remove friend
userRouter.post("/removefriend", isAuth, RemoveFriend);

export default userRouter;
