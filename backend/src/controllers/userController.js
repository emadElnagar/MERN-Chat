import User from "../models/User.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Generate Token
const generateToken = (user) => {
  return JWT.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

// User register
export const userRegister = async (req, res) => {
  const takenEmail = await User.findOne({ email: req.body.email });
  if (takenEmail) {
    res.status(401).json({
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
  await user
    .save()
    .then((_user) => {
      res.status(200).json({
        token,
      });
    })
    .catch((error) => {
      res.status(201).json({
        message: error.message,
      });
    });
};

// User login
export const userLogin = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({
        token,
      });
      return;
    }
  }
  res.status(401).send({ message: "invalid email or password" });
};

// Get all users
export const GetAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json({
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
    res.status(401).json({
      message: error.message,
    });
  }
};

// Change user Password
export const ChangePassword = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const validate = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!validate) {
      res.status(401).json({
        message: "Current password is not correct",
      });
    }
    const newUser = { password: await bcrypt.hash(req.body.newPassword, 10) };
    User.updateOne({ _id: req.params.id }, { $set: newUser })
      .then((_result) => {
        res.status(200).json({
          message: "Password changed successfully",
        });
      })
      .catch((error) => {
        res.status(401).json({
          message: error.message,
        });
      });
  }
};

// Change user image
export const ChangeUserImg = async (req, res) => {
  const newUser = { image: req.file.filename };
  User.updateOne({ _id: req.params.id }, { $set: newUser })
    .then((_result) => {
      res.status(200).json({
        message: "User image changed successfully",
      });
    })
    .catch((error) => {
      res.status(401).json({
        message: error.message,
      });
    });
};

// Delete user
export const DeleteUser = async (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((_result) => {
      res.status(201).json({
        message: "User Deleted Successfully",
      });
    })
    .catch((error) => {
      res.status(401).json({
        message: "Error Deleting User" + error.message,
      });
    });
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
  const { sender, receiver } = req.body;
  try {
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
  const { sender, receiver } = req.body;
  try {
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
  const { sender, receiver } = req.body;
  try {
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
  const { sender, receiver } = req.body;
  try {
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
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(400)
      .json({ message: "Token is required in the Authorization header" });
  }
  try {
    const tokenWithoutBearer = token.split(" ")[1];
    if (!tokenWithoutBearer) {
      return res
        .status(400)
        .json({ message: "Token is not properly formatted" });
    }
    const decoded = JWT.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    const userId = decoded._id;
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
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(400)
      .json({ message: "Token is required in the Authorization header" });
  }
  try {
    const tokenWithoutBearer = token.split(" ")[1];
    if (!tokenWithoutBearer) {
      return res
        .status(400)
        .json({ message: "Token is not properly formatted" });
    }
    const userId = JWT.verify(tokenWithoutBearer, process.env.JWT_SECRET)._id;
    await User.updateOne({ _id: userId }, { $pull: { friends: friendId } });
    await User.updateOne({ _id: friendId }, { $pull: { friends: userId } });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};
