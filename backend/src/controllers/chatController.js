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
  const sortedUsers = users.sort();

  try {
    const existingChat = await Chat.findOne({
      users: { $all: sortedUsers },
      isGroupChat,
    });
    if (existingChat) {
      return res
        .status(400)
        .json({ message: "Chat already exists with these users" });
    }
    const newChat = new Chat({
      chatName,
      isGroupChat,
      users,
      groupAdmin,
    });
    await newChat.save();
    return res.status(201).json(newChat);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Get all chats
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("messages")
      .sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
