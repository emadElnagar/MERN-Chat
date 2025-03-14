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
    res.status(500).json({ message: error.message });
  }
};
