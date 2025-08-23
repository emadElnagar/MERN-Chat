import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IoSend } from "react-icons/io5";
import { useEffect, useState } from "react";
import {
  CreateChat,
  FetchChats,
  FetchSingleChat,
} from "../../features/ChatFeatures";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorBox from "../../components/ErrorBox";
import UserAvatar from "../../assets/user-avatar.png";
import { getMessages, newMessage } from "../../features/MessageFeatures";
import ScrollableFeed from "react-scrollable-feed";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { GetFriends } from "../../features/UserFeatures";
import { useAlert } from "react-alert";
import { io } from "socket.io-client";

const ENDPOINT = `${import.meta.env.VITE_URL}`;
let socket, selectedChatCompare;

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [chatName, setChatName] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { friendsList } = useSelector((state) => state.user);
  const { chats, isLoading, error } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.message);
  let { chat } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  if (!user) {
    navigate("/users/login");
  }
  // Socket.io
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, [user]);
  // Fetch all chats
  useEffect(() => {
    dispatch(FetchChats(user._id));
  }, [dispatch, user._id]);
  // Fetch Single chat
  const getChat = (id) => {
    dispatch(FetchSingleChat(id));
  };
  // Default chat
  if (chats && !chat) {
    chat = chats[0];
  }
  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const messageData = {
      chat: chat._id,
      content: message,
    };

    try {
      const res = await dispatch(newMessage(messageData)).unwrap();
      setMessage("");
      socket.emit("new message", res);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  // Fetch messages
  useEffect(() => {
    if (!chat || !socket) return;

    dispatch(getMessages(chat._id));
    socket.emit("join chat", chat._id);
    selectedChatCompare = chat;
  }, [dispatch, chat]);
  // Get friends
  useEffect(() => {
    dispatch(GetFriends());
  }, [dispatch]);
  // Create new chat
  const createChat = (e) => {
    e.preventDefault();
    if (chatUsers.length === 0) {
      alert.error("Please select at least one user");
      return;
    }
    if (chatUsers.length > 1 && chatName.trim() === "") {
      alert.error("Please enter a chat name");
      return;
    }
    chatUsers.push(user._id);
    const chatData = {
      users: chatUsers,
      chatName,
    };
    dispatch(CreateChat(chatData))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        setChatUsers([]);
        setChatName("");
      });
  };
  // message received
  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        return;
      }
      dispatch(getMessages(chat._id));
    });

    return () => {
      socket.off("message received");
    };
  }, [dispatch, chat]);
  // Typing
  const typingHandler = (e) => {
    setMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", chat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime + 2000;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      <Helmet>
        <title>LiveTalk</title>
      </Helmet>
      <div className="container-fluid">
        <div className="chat-container">
          <div className="chat-list">
            <ScrollableFeed>
              {isLoading === true ? (
                <LoadingScreen />
              ) : error ? (
                <ErrorBox message={error.message} />
              ) : (
                chats.map((chat) => (
                  <div
                    className="chat"
                    key={chat._id}
                    onClick={() => getChat(chat._id)}
                  >
                    <img
                      src={
                        chat.isGroupChat
                          ? chat.groupAdmin.image
                            ? `${import.meta.env.VITE_URL}/` +
                              chat.groupAdmin.image
                            : UserAvatar
                          : user._id === chat.users[0]._id
                          ? chat.users[1].image
                            ? `${import.meta.env.VITE_URL}/` +
                              chat.users[1].image
                            : UserAvatar
                          : chat.users[0].image
                          ? `${import.meta.env.VITE_URL}/` + chat.users[0].image
                          : UserAvatar
                      }
                      alt="Chat"
                    />
                    <div className="chat-info">
                      {chat.isGroupChat ? (
                        <span className="chat-name">
                          <b>{chat.chatName}</b>
                        </span>
                      ) : user._id === chat.users[0]._id ? (
                        <span className="chat-name">
                          <b>
                            {chat.users[1].firstName} {chat.users[1].lastName}
                          </b>
                        </span>
                      ) : (
                        <span className="chat-name">
                          <b>
                            {chat.users[0].firstName} {chat.users[0].lastName}
                          </b>
                        </span>
                      )}
                      {chat.lastMessage &&
                        (chat.lastMessage.sender._id === user._id ? (
                          <div className="last-message">
                            <span>You: </span>
                            <span>
                              {chat.lastMessage.content.length > 20
                                ? chat.lastMessage.content.slice(0, 20) + "..."
                                : chat.lastMessage.content}
                            </span>
                          </div>
                        ) : (
                          <div className="last-message">
                            <span>{chat.lastMessage.sender.firstName}: </span>
                            <span>
                              {chat.lastMessage.content.length > 20
                                ? chat.lastMessage.content.slice(0, 20) + "..."
                                : chat.lastMessage.content}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </ScrollableFeed>
            <button
              className="new-chat-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus /> New Chat
            </button>
          </div>
          <div className={`modal ${isModalOpen ? "" : "disappear"}`}>
            <div className="modal-content">
              <button className="close" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
              <h4 className="modal-header">Create a new chat</h4>
              <div className="modal-form">
                <form onSubmit={(e) => createChat(e)}>
                  <input
                    type="text"
                    placeholder="Enter chat name"
                    value={chatName}
                    disabled={chatUsers.length <= 1}
                    onChange={(e) => setChatName(e.target.value)}
                  />
                  <button type="submit" className="search-btn">
                    Create
                  </button>
                </form>
              </div>
              <div className="user-frineds">
                <ScrollableFeed>
                  {friendsList &&
                    friendsList.friends &&
                    friendsList.friends.length > 0 &&
                    friendsList.friends.map((friend) => (
                      <div className="user-friend" key={friend._id}>
                        <img
                          src={
                            friend.image
                              ? `${import.meta.env.VITE_URL}/` + friend.image
                              : UserAvatar
                          }
                          alt="User"
                        />
                        <div className="user-friend-info">
                          <p className="user-friend-name">
                            {friend.firstName} {friend.lastName}
                          </p>
                        </div>
                        {chatUsers &&
                        chatUsers.length > 0 &&
                        chatUsers.includes(friend._id) ? (
                          <button
                            className="remove-friend-btn"
                            onClick={() => {
                              setChatUsers(
                                chatUsers.filter((user) => user !== friend._id)
                              );
                            }}
                          >
                            <FaMinus />
                          </button>
                        ) : (
                          <button
                            className="add-friend-btn"
                            onClick={() => {
                              setChatUsers([...chatUsers, friend._id]);
                            }}
                          >
                            <FaPlus />
                          </button>
                        )}
                      </div>
                    ))}
                </ScrollableFeed>
              </div>
            </div>
          </div>
          <div className="current-chat">
            {chat ? (
              <>
                <div className="chat-window">
                  <ScrollableFeed>
                    {chat && messages && messages.length > 0
                      ? messages.map((message) => (
                          <div
                            className={
                              message.sender._id === user._id
                                ? "message message-sent"
                                : "message message-received"
                            }
                            key={message._id}
                          >
                            {message.sender._id !== user._id && (
                              <img
                                src={
                                  message.sender.image
                                    ? `${import.meta.env.VITE_URL}/` +
                                      message.sender.image
                                    : UserAvatar
                                }
                                alt="User"
                              />
                            )}
                            <p className="message-content">{message.content}</p>
                          </div>
                        ))
                      : null}
                    {isTyping && (
                      <div className="typing-indicator">
                        <em>Typing...</em>
                      </div>
                    )}
                  </ScrollableFeed>
                </div>
                <div className="chat-form">
                  <form type="POST" onSubmit={(e) => handleSubmit(e)}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      onChange={(e) => typingHandler(e)}
                      value={message}
                    />
                    <button type="submit">
                      <IoSend />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="no-chat">
                <h4>Select a chat to start messaging</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
