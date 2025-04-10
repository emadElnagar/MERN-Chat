import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IoSend } from "react-icons/io5";
import { useEffect } from "react";
import { FetchChats, FetchSingleChat } from "../../features/ChatFeatures";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorBox from "../../components/ErrorBox";
import UserAvatar from "../../assets/user-avatar.png";

const ChatPage = () => {
  const { user } = useSelector((state) => state.user);
  const { chats, isLoading, error } = useSelector((state) => state.chat);
  let { chat } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!user) {
    navigate("/users/login");
  }
  useEffect(() => {
    dispatch(FetchChats(user._id));
  }, [dispatch, user._id]);
  const getChat = (id) => {
    dispatch(FetchSingleChat(id));
  };
  if (chats && !chat) {
    chat = chats[0];
  }
  return (
    <>
      <Helmet>
        <title>LiveTalk</title>
      </Helmet>
      <div className="container">
        <div className="chat-container">
          <div className="chat-list">
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
                    <p>{chat.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="current-chat">
            <div className="chat-window">
              <div className="message-received">
                <img src="https://placehold.co/50x50" alt="User" />
                <p className="message-content">Hello</p>
              </div>
              <div className="message-sent">
                <p className="message-content">Hi there</p>
                <span className="message-status">seen</span>
              </div>
            </div>
            <div className="chat-form">
              <form>
                <input type="text" placeholder="Type a message..." />
                <button>
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
