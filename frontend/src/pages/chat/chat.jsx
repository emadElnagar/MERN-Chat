import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IoSend } from "react-icons/io5";
import { useEffect, useState } from "react";
import { FetchChats, FetchSingleChat } from "../../features/ChatFeatures";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorBox from "../../components/ErrorBox";
import UserAvatar from "../../assets/user-avatar.png";
import { getMessages, newMessage } from "../../features/MessageFeatures";
import ScrollableFeed from "react-scrollable-feed";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.user);
  const { chats, isLoading, error } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.message);
  let { chat } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!user) {
    navigate("/users/login");
  }
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      return;
    }
    const messageData = {
      chat: chat._id,
      content: message,
    };
    dispatch(newMessage(messageData));
    setMessage("");
  };
  // Fetch messages
  useEffect(() => {
    if (chat) {
      dispatch(getMessages(chat._id));
    }
  }, [dispatch, chat]);

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
                            ? "http://localhost:5000/" + chat.groupAdmin.image
                            : UserAvatar
                          : user._id === chat.users[0]._id
                          ? chat.users[1].image
                            ? "http://localhost:5000/" + chat.users[1].image
                            : UserAvatar
                          : chat.users[0].image
                          ? "http://localhost:5000/" + chat.users[0].image
                          : UserAvatar
                      }
                      alt="Chat"
                    />
                    <div className="chat-info">
                      {chat.isGroupChat ? (
                        <span>
                          <b>{chat.chatName}</b>
                        </span>
                      ) : user._id === chat.users[0]._id ? (
                        <span>
                          <b>
                            {chat.users[1].firstName} {chat.users[1].lastName}
                          </b>
                        </span>
                      ) : (
                        <span>
                          <b>
                            {chat.users[0].firstName} {chat.users[0].lastName}
                          </b>
                        </span>
                      )}
                      <p>{chat.lastMessage && chat.lastMessage.content}</p>
                    </div>
                  </div>
                ))
              )}
            </ScrollableFeed>
            <button className="new-chat-btn">+ New Chat</button>
          </div>
          <div className="current-chat">
            <div className="chat-window">
              <div className="modal">
                <div className="modal-content">
                  <button className="close">&times;</button>
                  <p className="modal-header">Create a new chat</p>
                </div>
              </div>
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
                                ? "http://localhost:5000/" +
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
              </ScrollableFeed>
            </div>
            <div className="chat-form">
              <form type="POST" onSubmit={(e) => handleSubmit(e)}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  value={message}
                />
                <button type="submit">
                  <IoSend />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
