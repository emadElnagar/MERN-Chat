import reactLogo from '../assets/chat-icon.png';
import { AiFillMessage } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { IoSettingsSharp, IoSunnySharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

const Header = () => {
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
            <li><MdLogout className='icon' title='logout' /></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header;
