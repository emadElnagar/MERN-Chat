import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IoSend } from "react-icons/io5";
import { useEffect, useState, useRef } from "react";
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

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [chatName, setChatName] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef(null);
  const selectedChatRef = useRef(null);

  const { user } = useSelector((state) => state.user);
  const { friendsList } = useSelector((state) => state.user);
  const { chats, isLoading, error, chat } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.message);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/users/login");
  }, [user, navigate]);

  // Socket.io setup
  useEffect(() => {
    if (!user) return;

    const newSocket = io(ENDPOINT);

    newSocket.emit("setup", user);

    newSocket.on("connected", () => setSocketConnected(true));
    newSocket.on("typing", () => setIsTyping(true));
    newSocket.on("stop typing", () => setIsTyping(false));
    newSocket.on("error", (err) => {
      console.error("Socket error:", err);
      alert.error("Socket connection failed. Please try again later.");
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, [user, alert]);

  // Fetch all chats
  useEffect(() => {
    if (user?._id) {
      dispatch(FetchChats(user._id));
    }
  }, [dispatch, user?._id]);

  // Fetch single chat
  const getChat = (id) => {
    dispatch(FetchSingleChat(id));
  };

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "" || !chat) return;

    const messageData = {
      chat: chat._id,
      content: message,
    };

    try {
      const res = await dispatch(newMessage(messageData)).unwrap();
      setMessage("");
      socketRef.current?.emit("new message", res);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert.error("Failed to send message");
    }
  };

  // Fetch messages when chat changes
  useEffect(() => {
    if (!chat || !socketRef.current) return;

    dispatch(getMessages(chat._id));
    socketRef.current.emit("join chat", chat._id);
    selectedChatRef.current = chat;
  }, [dispatch, chat]);

  // Get friends list
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

    const chatData = {
      users: [...chatUsers, user._id],
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

  // Listen for new messages
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatRef.current ||
        selectedChatRef.current._id !== newMessage.chat._id
      ) {
        // could show notification for other chats here
        return;
      }
      dispatch(getMessages(chat._id));
    });

    return () => {
      socket.off("message received");
    };
  }, [dispatch, chat]);

  // Typing handler
  const typingHandler = (e) => {
    setMessage(e.target.value);
    if (!socketConnected || !chat) return;

    if (!typing) {
      setTyping(true);
      socketRef.current?.emit("typing", chat._id);
    }

    const lastTypingTime = Date.now();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = Date.now();
      if (timeNow - lastTypingTime >= timerLength && typing) {
        socketRef.current?.emit("stop typing", chat._id);
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
          {/* Chat list */}
          <div className="chat-list">
            <ScrollableFeed>
              {isLoading ? (
                <LoadingScreen />
              ) : error ? (
                <ErrorBox message={error.message} />
              ) : (
                chats?.map((chat) => (
                  <div
                    className="chat"
                    key={chat._id}
                    onClick={() => getChat(chat._id)}
                  >
                    <img
                      src={
                        chat.isGroupChat
                          ? chat.groupAdmin?.image
                            ? `${import.meta.env.VITE_URL}/` +
                              chat.groupAdmin.image
                            : UserAvatar
                          : user._id === chat.users[0]._id
                          ? chat.users[1]?.image
                            ? `${import.meta.env.VITE_URL}/` +
                              chat.users[1].image
                            : UserAvatar
                          : chat.users[0]?.image
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

          {/* Create chat modal */}
          <div className={`modal ${isModalOpen ? "" : "disappear"}`}>
            <div className="modal-content">
              <button className="close" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
              <h4 className="modal-header">Create a new chat</h4>
              <div className="modal-form">
                <form onSubmit={createChat}>
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
              <div className="user-friends">
                <ScrollableFeed>
                  {friendsList?.friends?.map((friend) => (
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
                      {chatUsers.includes(friend._id) ? (
                        <button
                          className="remove-friend-btn"
                          onClick={() =>
                            setChatUsers(
                              chatUsers.filter((id) => id !== friend._id)
                            )
                          }
                        >
                          <FaMinus />
                        </button>
                      ) : (
                        <button
                          className="add-friend-btn"
                          onClick={() =>
                            setChatUsers([...chatUsers, friend._id])
                          }
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

          {/* Current chat */}
          <div className="current-chat">
            {chat ? (
              <>
                <div className="chat-window">
                  <ScrollableFeed>
                    {messages?.map((m) => (
                      <div
                        className={
                          m.sender._id === user._id
                            ? "message message-sent"
                            : "message message-received"
                        }
                        key={m._id}
                      >
                        {m.sender._id !== user._id && (
                          <img
                            src={
                              m.sender.image
                                ? `${import.meta.env.VITE_URL}/` +
                                  m.sender.image
                                : UserAvatar
                            }
                            alt="User"
                          />
                        )}
                        <p className="message-content">{m.content}</p>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="typing-indicator">
                        <em>Typing...</em>
                      </div>
                    )}
                  </ScrollableFeed>
                </div>
                <div className="chat-form">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      onChange={typingHandler}
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
