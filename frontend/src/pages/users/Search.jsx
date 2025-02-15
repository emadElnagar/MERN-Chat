import { Fragment } from "react";
import { Helmet } from "react-helmet";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

const SearchPage = () => {
  return (
    <Fragment>
      <Helmet>
        <title>LiveTalk-search</title>
      </Helmet>
      <div className="container">
        <form onSubmit={(e) => e.preventDefault()} className="search">
          <input type="text" placeholder="Search users" />
          <button type="submit">
            <IoSearchSharp />
          </button>
        </form>
        <div className="users-list">
          <ul>
            <li>
              <div className="user image">
                <img
                  src="https://th.bing.com/th/id/OIP.wEsBe2udHBieFeZVmus8qAHaHk?rs=1&pid=ImgDetMain"
                  alt="problem showing image"
                />
              </div>
              <div className="user-name">
                <h4>John Doe</h4>
              </div>
              <div className="button">
                <button>
                  Add friend <IoIosPersonAdd />
                </button>
              </div>
            </li>
            <li>
              <div className="user image">
                <img
                  src="https://th.bing.com/th/id/OIP.wEsBe2udHBieFeZVmus8qAHaHk?rs=1&pid=ImgDetMain"
                  alt="problem showing image"
                />
              </div>
              <div className="user-name">
                <h4>John Doe</h4>
              </div>
              <div className="button">
                <button>
                  Add friend <IoIosPersonAdd />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchPage;
