import { Fragment, useState } from "react";
import { Helmet } from "react-helmet";
import { IoIosChatboxes, IoIosClose, IoIosCheckmark } from "react-icons/io";
import { FaUserMinus } from "react-icons/fa";

const FriendsPage = () => {
  const [tab, setTab] = useState("friends");
  return (
    <Fragment>
      <Helmet>
        <title>LiveTalk-friends</title>
      </Helmet>
      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${tab === "friends" ? "active" : ""}`}
            onClick={() => setTab("friends")}
          >
            Friends
          </button>
          <button
            className={`tab ${tab === "requests" ? "active" : ""}`}
            onClick={() => setTab("requests")}
          >
            Friend requests
          </button>
          <button
            className={`tab ${tab === "sent" ? "active" : ""}`}
            onClick={() => setTab("sent")}
          >
            Sent requests
          </button>
        </div>
        <div className="users-list">
          {tab === "friends" && (
            <ul>
              <li>
                <div className="user image">
                  <img
                    src="https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"
                    alt="problem showing image"
                  />
                </div>
                <div className="user-name">
                  <h4>John Doe</h4>
                </div>
                <div className="button">
                  <button>
                    Chat <IoIosChatboxes />
                  </button>
                </div>
              </li>
            </ul>
          )}
          {tab === "requests" && (
            <ul>
              {tab === "requests" && (
                <ul>
                  <li>
                    <div className="user image">
                      <img
                        src="https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"
                        alt="problem showing image"
                      />
                    </div>
                    <div className="user-name">
                      <h4>John Doe</h4>
                    </div>
                    <div className="button">
                      <button>
                        Accept <IoIosCheckmark />
                      </button>
                      <button>
                        Decline <IoIosClose />
                      </button>
                    </div>
                  </li>
                </ul>
              )}
            </ul>
          )}
          {tab === "sent" && (
            <ul>
              {tab === "sent" && (
                <ul>
                  <li>
                    <div className="user image">
                      <img
                        src="https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"
                        alt="problem showing image"
                      />
                    </div>
                    <div className="user-name">
                      <h4>John Doe</h4>
                    </div>
                    <div className="button">
                      <button>
                        Cancel request <FaUserMinus />
                      </button>
                    </div>
                  </li>
                </ul>
              )}
            </ul>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default FriendsPage;
