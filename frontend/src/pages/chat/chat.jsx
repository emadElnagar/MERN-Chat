import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  if (!user) {
    navigate("/users/login");
  }
  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-box"></div>
        <div className="message-box"></div>
      </div>
    </div>
  );
};

export default ChatPage;
