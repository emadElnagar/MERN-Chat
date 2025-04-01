import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { IoSend } from "react-icons/io5";
import { useEffect } from "react";
import { FetchChats } from "../../features/ChatFeatures";

const ChatPage = () => {
  const { user } = useSelector((state) => state.user);
  const { chats, isLoading, error } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!user) {
    navigate("/users/login");
  }
  useEffect(() => {
    dispatch(FetchChats(user._id));
  }, [dispatch, user._id]);
  return (
    <>
      <Helmet>
        <title>LiveTalk</title>
      </Helmet>
      <div className="container">
        <div className="chat-container">
          <div className="chat-list">
            <div className="chat">
              <img src="https://placehold.co/50x50" alt="User" />
              <div className="chat-info">
                <span>
                  <b>John Doe</b>
                </span>
                <p>Last message...</p>
              </div>
            </div>
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
