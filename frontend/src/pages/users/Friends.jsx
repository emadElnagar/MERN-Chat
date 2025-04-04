import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { IoIosChatboxes, IoIosClose, IoIosCheckmark } from "react-icons/io";
import { FaUserMinus, FaUserTimes } from "react-icons/fa";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorBox from "../../components/ErrorBox";
import UserAvatar from "../../assets/user-avatar.png";
import {
  CancelRequest,
  AcceptRequest,
  RejectRequest,
  Unfriend,
  GetFriends,
} from "../../features/UserFeatures";
import { CreateChat } from "../../features/ChatFeatures";

const FriendsPage = () => {
  const { user, error, isLoading, friendsList } = useSelector(
    (state) => state.user
  );
  const [tab, setTab] = useState("friends");
  const [chatUsers, setChatUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!user) {
    navigate("/login");
  }
  // Get friends list
  useEffect(() => {
    dispatch(GetFriends());
  }, [dispatch]);
  // Cancel friend request
  const handleCancelRequest = (id) => {
    dispatch(CancelRequest(id));
    dispatch(GetFriends());
  };
  // Accept friend request
  const handleAcceptRequest = (id) => {
    dispatch(AcceptRequest(id));
    dispatch(GetFriends());
  };
  // Reject friend request
  const handleRejectRequest = (id) => {
    dispatch(RejectRequest(id));
    dispatch(GetFriends());
  };
  // Unfriend
  const handleUnfriend = (id) => {
    dispatch(Unfriend(id));
    dispatch(GetFriends());
  };
  // Create chat
  const createChat = () => {
    const chatData = {
      users: chatUsers,
    };
    dispatch(CreateChat(chatData))
      .unwrap()
      .then(() => {
        setChatUsers([]);
        navigate("/");
      });
  };
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
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            chatUsers.push(friend._id);
                            chatUsers.push(user._id);
                            createChat();
                          }}
                        >
                          Chat <IoIosChatboxes />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleUnfriend(friend._id);
                          }}
                        >
                          Unfriend <FaUserTimes />
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
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAcceptRequest(friend._id);
                          }}
                        >
                          Accept <IoIosCheckmark />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRejectRequest(friend._id);
                          }}
                        >
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
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleCancelRequest(friend._id);
                          }}
                        >
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
