import reactLogo from '../assets/chat-icon.png';
import { AiFillMessage } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { IoSettingsSharp, IoSunnySharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logout } from '../features/UserFeatures';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // User logout
  const handleLogout = () => {
    dispatch(Logout());
    navigate('/');
  }
  return (
    <header>
      <nav>
        <div>
          <img src={reactLogo} className="logo" alt="Vite logo" />
        </div>
        <div>
          <ul>
            <li><AiFillMessage className='icon' title='chats' /></li>
            <li><FaUserAlt className='icon' title='profile' /></li>
            <li><IoSettingsSharp className='icon' title='settings' /></li>
          </ul>
        </div>
        <div className='user'>
          <ul>
            <li><IoSunnySharp className='icon' title='light' /></li>
            <li><MdLogout className='icon' title='logout' onClick={handleLogout} /></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header;
