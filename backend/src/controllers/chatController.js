import Chat from "../models/chat.js";

// Create a new chat
export const createChat = async (req, res) => {
  const { chatName, users, groupAdmin } = req.body;

  if (!chatName) {
    return res.status(400).json({ message: "Chat name is required" });
  }
  if (!users) {
    return res.status(400).json({ message: "Users are required" });
  }
  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "A chat must have at least two users" });
  }

  const isGroupChat = users.length > 2;

  try {
    const newChat = new Chat({
      chatName,
      isGroupChat,
      users,
      groupAdmin,
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Get all chats
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
