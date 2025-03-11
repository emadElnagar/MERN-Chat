import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  AddFriend,
  CancelRequest,
  GetFriends,
  SearchUsers,
} from "../../features/UserFeatures";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorBox from "../../components/ErrorBox";
import UserAvatar from "../../assets/user-avatar.png";
import { useNavigate } from "react-router-dom";
import { IoIosCheckmark, IoIosClose, IoIosChatboxes } from "react-icons/io";
import { FaUserMinus } from "react-icons/fa";

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
  };
  // Cancel request friend
  const handleCancelRequest = (id) => {
    dispatch(CancelRequest(id));
  };
  return (
    <Fragment>
      <Helmet>
        <title>LiveTalk-search</title>
      </Helmet>
      <div className="container">
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
                          <button>
                            Chat <IoIosChatboxes />
                          </button>
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
                            <button>
                              Accept <IoIosCheckmark />
                            </button>
                            <button>
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
      </div>
    </Fragment>
  );
};

export default SearchPage;
