import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { IoIosChatboxes, IoIosClose, IoIosCheckmark } from "react-icons/io";
import { FaUserMinus } from "react-icons/fa";
import { GetFriends } from "../../features/UserFeatures";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorBox from "../../components/ErrorBox";
import UserAvatar from "../../assets/user-avatar.png";

const FriendsPage = () => {
  const { user, error, isLoading, friendsList } = useSelector(
    (state) => state.user
  );
  const [tab, setTab] = useState("friends");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!user) {
    navigate("/login");
  }
  // Get friends list
  useEffect(() => {
    dispatch(GetFriends());
  }, [dispatch]);
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
          {isLoading ? (
            <LoadingScreen />
          ) : error ? (
            <ErrorBox message={error} />
          ) : (
            <ul>
              {tab === "friends" &&
                (friendsList &&
                friendsList.friends &&
                friendsList.friends.length > 0 ? (
                  friendsList.friends.map((friend, index) => (
                    <li key={index}>
                      <div className="user image">
                        <img
                          src={`${
                            friend.image
                              ? "http://localhost:5000/" + friend.image
                              : UserAvatar
                          }`}
                          alt="problem showing image"
                        />
                      </div>
                      <div className="user-name">
                        <h4>
                          {friend.firstName} {friend.lastName}
                        </h4>
                      </div>
                      <div className="button">
                        <button>
                          Chat <IoIosChatboxes />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <h4>No friends yet</h4>
                ))}
              {tab === "requests" &&
                (friendsList &&
                friendsList.friendRequests &&
                friendsList.friendRequests.length > 0 ? (
                  friendsList.friendRequests.map((friend, index) => (
                    <li key={index}>
                      <div className="user image">
                        <img
                          src={`${
                            friend.image
                              ? "http://localhost:5000/" + friend.image
                              : UserAvatar
                          }`}
                          alt="problem showing image"
                        />
                      </div>
                      <div className="user-name">
                        <h4>
                          {friend.firstName} {friend.lastName}
                        </h4>
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
                  ))
                ) : (
                  <h4>No friend requests found</h4>
                ))}
              {tab === "sent" &&
                (friendsList &&
                friendsList.sentRequests &&
                friendsList.sentRequests.length > 0 ? (
                  friendsList.sentRequests.map((friend, index) => (
                    <li key={index}>
                      <div className="user image">
                        <img
                          src={`${
                            friend.image
                              ? "http://localhost:5000/" + friend.image
                              : UserAvatar
                          }`}
                          alt="problem showing image"
                        />
                      </div>
                      <div className="user-name">
                        <h4>
                          {friend.firstName} {friend.lastName}
                        </h4>
                      </div>
                      <div className="button">
                        <button>
                          Cancel request <FaUserMinus />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <h4>No sent requests found</h4>
                ))}
            </ul>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default FriendsPage;
