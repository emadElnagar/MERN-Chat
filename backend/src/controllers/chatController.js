import Chat from "../models/Chat.js";

// Create a new chat
export const createChat = async (req, res) => {
  let { chatName, users } = req.body;
  const groupAdmin = req.user._id;

  if (!users) {
    return res.status(400).json({ message: "Users are required" });
  }
  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "A chat must have at least two users" });
  }

  if (!chatName) {
    if (users.length > 2) {
      return res
        .status(400)
        .json({ message: "Chat name is required for group chats" });
    }
    chatName = req.body.users.map((user) => user).join(",");
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
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Get single chat
export const getSingleChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastMessage");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Rename chat
export const renameChat = async (req, res) => {
  const { chatId } = req.params;
  const { chatName } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    chat.chatName = chatName;
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Add user to chat
export const addUserToChat = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (chat.isGroupChat === false) {
      return res
        .status(400)
        .json({ message: "Cannot add user to single chat" });
    }
    if (chat.users.includes(userId)) {
      return res.status(400).json({ message: "User already in chat" });
    }
    chat.users.push(userId);
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Remove user from chat
export const removeUserFromChat = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (chat.isGroupChat === false) {
      return res
        .status(400)
        .json({ message: "Cannot remove user from single chat" });
    }
    if (!chat.users.includes(userId)) {
      return res.status(400).json({ message: "User not in chat" });
    }
    chat.users = chat.users.filter((user) => user !== userId);
    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
