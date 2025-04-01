import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const ChatPage = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  if (!user) {
    navigate("/users/login");
  }

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
          <div className="current-chat"></div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
