import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  AcceptRequest,
  AddFriend,
  CancelRequest,
  GetFriends,
  RejectRequest,
  SearchUsers,
  Unfriend,
} from "../../features/UserFeatures";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorBox from "../../components/ErrorBox";
import UserAvatar from "../../assets/user-avatar.png";
import { useNavigate } from "react-router-dom";
import { IoIosCheckmark, IoIosClose, IoIosChatboxes } from "react-icons/io";
import { FaUserMinus, FaUserTimes } from "react-icons/fa";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading, searchedUsers, user, friendsList } = useSelector(
    (state) => state.user
  );
  if (!user) {
    navigate("/users/login");
  }
  // Search users
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(SearchUsers(search));
  };
  // Get user friends
  useEffect(() => {
    dispatch(GetFriends());
  }, [dispatch, navigate, user]);
  // Send friend request
  const handleAddFriend = (id) => {
    dispatch(AddFriend(id));
    dispatch(GetFriends());
  };
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
  return (
    <Fragment>
      <Helmet>
        <title>LiveTalk-search</title>
      </Helmet>
      <div className="container">
        <section>
          <form onSubmit={handleSearch} className="search">
            <input
              type="text"
              placeholder="Search users"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">
              <IoSearchSharp />
            </button>
          </form>
          <div className="users-list">
            <ul>
              {isLoading ? (
                <LoadingScreen />
              ) : error ? (
                <ErrorBox message={error} />
              ) : (
                searchedUsers &&
                searchedUsers.users &&
                searchedUsers.users.map((searchedUser, index) => (
                  <li key={index}>
                    <div className="user image">
                      <img
                        src={`${
                          searchedUser.image
                            ? "http://localhost:5000/" + searchedUser.image
                            : UserAvatar
                        }`}
                        alt="problem showing image"
                      />
                    </div>
                    <div className="user-name">
                      <h4>
                        {searchedUser.firstName} {searchedUser.lastName}
                      </h4>
                    </div>
                    <div className="button">
                      {searchedUser && friendsList && (
                        <>
                          {friendsList.friends.find(
                            (friend) => friend._id === searchedUser._id
                          ) ? (
                            <>
                              <button>
                                Chat <IoIosChatboxes />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleUnfriend(searchedUser._id);
                                }}
                              >
                                Unfriend <FaUserTimes />
                              </button>
                            </>
                          ) : friendsList.sentRequests.find(
                              (sentRequest) =>
                                sentRequest._id === searchedUser._id
                            ) ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleCancelRequest(searchedUser._id);
                              }}
                            >
                              Cancel request <FaUserMinus />
                            </button>
                          ) : friendsList.friendRequests.find(
                              (friendRequest) =>
                                friendRequest._id === searchedUser._id
                            ) ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAcceptRequest(searchedUser._id);
                                }}
                              >
                                Accept <IoIosCheckmark />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRejectRequest(searchedUser._id);
                                }}
                              >
                                Decline <IoIosClose />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddFriend(searchedUser._id);
                              }}
                            >
                              Add friend <IoIosPersonAdd />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default SearchPage;
