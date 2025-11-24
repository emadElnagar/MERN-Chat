import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

// Generate access token
export const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Generate refresh token
export const generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper to verify refresh tokens. Returns decoded payload or null on failure.
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Auth middleware
export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err && err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }
      return res.status(401).json({ message: "Invalid access token" });
    }

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("isAuth middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin check middleware (safe response instead of throwing)
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Not authorized as an admin" });
};
