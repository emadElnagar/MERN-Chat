import User from "../models/User.js";
import bcrypt from "bcrypt";
import {
  generateToken,
  generateRefreshToken,
} from "../middlewares/authMiddleWare.js";

// User register
export const userRegister = async (req, res) => {
  try {
    const takenEmail = await User.findOne({ email: req.body.email });
    if (takenEmail) {
      return res.status(401).json({
        message: "This email have already taken, please try another one",
      });
    }
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });
    const token = generateToken(user);
    await user.save();
    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// User login
export const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const validate = await bcrypt.compare(req.body.password, user.password);
    if (!validate) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password, ...userData } = user.toObject();
    res.status(200).json({ userData, accessToken });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all users
export const GetAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get single user
export const GetSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Change user Password
export const ChangePassword = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    const validate = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!validate) {
      return res.status(401).json({
        message: "Current password is not correct",
      });
    }
    const newUser = { password: await bcrypt.hash(req.body.newPassword, 10) };
    await User.updateOne({ _id: user._id }, { $set: newUser });
    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Change user image
export const ChangeUserImg = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    const newUser = { image: req.file.filename };
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    await User.updateOne({ _id: user._id }, { $set: newUser });
    res.status(200).json({
      message: "User image changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete user (Admin only)
export const DeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Search user
export const SearchUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, user not found" });
  }
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json({ users });
};

// Send friend request
export const SendFriendRequest = async (req, res) => {
  const { receiver } = req.body;
  try {
    const sender = req.user._id;
    await User.updateOne(
      { _id: sender },
      { $addToSet: { sentRequests: receiver } }
    );
    await User.updateOne(
      { _id: receiver },
      { $addToSet: { friendRequests: sender } }
    );
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// Cancel friend request
export const CancelFriendRequest = async (req, res) => {
  const { receiver } = req.body;
  try {
    const sender = req.user._id;
    await User.updateOne(
      { _id: sender },
      { $pull: { sentRequests: receiver } }
    );
    await User.updateOne(
      { _id: receiver },
      { $pull: { friendRequests: sender } }
    );
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// Reject friend request
export const RejectFriendRequest = async (req, res) => {
  const { sender } = req.body;
  try {
    const receiver = req.user._id;
    await User.updateOne(
      { _id: sender },
      { $pull: { sentRequests: receiver } }
    );
    await User.updateOne(
      { _id: receiver },
      { $pull: { friendRequests: sender } }
    );
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// Accept friend request
export const AcceptFriendRequest = async (req, res) => {
  const { sender } = req.body;
  try {
    const receiver = req.user._id;
    await User.updateOne(
      { _id: sender },
      { $pull: { sentRequests: receiver } }
    );
    await User.updateOne(
      { _id: receiver },
      { $pull: { friendRequests: sender } }
    );
    await User.updateOne({ _id: sender }, { $addToSet: { friends: receiver } });
    await User.updateOne({ _id: receiver }, { $addToSet: { friends: sender } });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// Get friends
export const GetFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const friends = await User.find({ _id: { $in: user.friends } }).select(
      "_id firstName lastName email image"
    );
    const sentRequests = await User.find({
      _id: { $in: user.sentRequests },
    }).select("_id firstName lastName email image");
    const friendRequests = await User.find({
      _id: { $in: user.friendRequests },
    }).select("_id firstName lastName email image");
    res.status(200).json({
      friends,
      sentRequests,
      friendRequests,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// Remove friend
export const RemoveFriend = async (req, res) => {
  const { friendId } = req.body;
  try {
    const userId = req.user._id;
    await User.updateOne({ _id: userId }, { $pull: { friends: friendId } });
    await User.updateOne({ _id: friendId }, { $pull: { friends: userId } });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};
