import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// Create a new message
export const NewMessage = async (req, res) => {
  const { content, chat } = req.body;
  const sender = req.user._id;

  if (!content || !chat || !sender) {
    return res.status(401).json({
      message: "Invalid data passed",
    });
  }

  const newMessage = new Message({
    content,
    chat,
    sender,
  });

  try {
    let message = await Message.create(newMessage);

    message = await message.populate(
      "sender",
      "firstName lastName image email"
    );
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName image email",
    });

    await Chat.findByIdAndUpdate(req.body.chat, { lastMessage: message });
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// Get chat messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.id })
      .populate("sender", "_id firstName lastName image email")
      .populate("chat")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};
