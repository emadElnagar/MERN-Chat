import LiveTalk from "../assets/chat-icon.png";
import { AiFillMessage } from "react-icons/ai";
import { FaUserAlt, FaUserFriends } from "react-icons/fa";
import { IoSettingsSharp, IoSunnySharp, IoSearchSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "../features/UserFeatures";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  // User logout
  const handleLogout = () => {
    dispatch(Logout());
    navigate("/");
  };
  return (
    <header>
      <nav>
        <div>
          <Link to={"/"}>
            <img src={LiveTalk} className="logo" alt="Vite logo" />
          </Link>
        </div>
        <div>
          <ul>
            <li>
              <Link to={"/"}>
                <AiFillMessage className="icon" title="chats" />
              </Link>
            </li>
            <li>
              <Link to={`/users/profile/${user && user._id}`}>
                <FaUserAlt className="icon" title="profile" />
              </Link>
            </li>
            <li>
              <FaUserFriends className="icon" title="friends" />
            </li>
            <li>
              <IoSearchSharp className="icon" title="search" />
            </li>
            <li>
              <IoSettingsSharp className="icon" title="settings" />
            </li>
          </ul>
        </div>
        <div className="user">
          <ul>
            <li>
              <IoSunnySharp className="icon" title="light" />
            </li>
            <li>
              <MdLogout
                className="icon"
                title="logout"
                onClick={handleLogout}
              />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
