import "./App.css";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/users/Login";
import Profile from "./pages/users/Profile";
import RegisterPage from "./pages/users/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { useSelector, useDispatch } from "react-redux";
import ChatPage from "./pages/chat/chat";
import SearchPage from "./pages/users/Search";
import FriendsPage from "./pages/users/Friends";
import { useEffect, useState } from "react";
import { initSocket } from "./socket";
import { getMessages } from "./features/MessageFeatures";
import { updateLastMessage } from "./features/ChatFeatures";
import store from "./store";
import { useAlert } from "react-alert";
import SettingsPage from "./pages/users/Settings";

function App() {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);

  const [notifications, setNotifications] = useState([]);

  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    if (!user) return;

    const socket = initSocket(user);

    socket.on("connected", () => {
      console.log("Socket connected");
    });

    // Global "message received" listener
    socket.on("message received", (newMessage) => {
      const state = store.getState();
      const { chat } = state.chat;

      // If user is inside the same chat refresh messages
      if (chat && chat._id === newMessage.chat._id) {
        dispatch(getMessages(newMessage.chat._id));
      } else {
        if (!notifications.includes(newMessage.chat._id)) {
          setNotifications((prev) => [...prev, newMessage.chat._id]);
          alert.show("New Message Received!", { type: "info" });
        }
      }

      // Always update sidebar last message
      dispatch(
        updateLastMessage({
          chatId: newMessage.chat._id,
          lastMessage: newMessage,
        })
      );
    });

    return () => {
      socket.off("message received");
    };
  }, [user, dispatch, alert, notifications]);

  return (
    <div className={`${theme}`}>
      <BrowserRouter>
        {user && <Header />}
        <Routes>
          {user ? (
            <Route path="/" element={<ChatPage />} />
          ) : (
            <Route path="/" element={<LoginPage />} />
          )}
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/register" element={<RegisterPage />} />
          <Route path="/users/profile/:id" element={<Profile />} />
          <Route path="/users/friends" element={<FriendsPage />} />
          <Route path="/users/search" element={<SearchPage />} />
          <Route path="/users/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
