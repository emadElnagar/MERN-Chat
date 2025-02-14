import "./App.css";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/users/Login";
import Profile from "./pages/users/Profile";
import RegisterPage from "./pages/users/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { useSelector } from "react-redux";
import ChatPage from "./pages/chat/chat";

function App() {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  return (
    <div className={`${theme}`}>
      <BrowserRouter>
        {user && <Header />}
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/register" element={<RegisterPage />} />
          <Route path="/users/profile/:id" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
