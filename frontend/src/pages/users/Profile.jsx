import { useEffect } from "react"
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"
import { GetSingleUser } from "../../features/UserFeatures";
import UserAvatar from "../../assets/user-avatar.png"
import LoadingScreen from "../../components/LoadingScreen";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile, isLoading } = useSelector((state) => state.user);
  const { id } = useParams();
  useEffect(() => {
    dispatch(GetSingleUser(id));
  }, [dispatch, id]);
  if (! user) {
    navigate("/users/login");
  }
  return (
    <>
      <Helmet>
        <title>LiveTalk-profile</title>
      </Helmet>
      <div className="container">
        {
          isLoading ? <LoadingScreen /> :
          <div className="img-container">  
            <div className="image">  
              <img
                src={`${profile.image ? profile.image : UserAvatar}`} 
                alt="user avatar"
                className="profile-img"
              />
            </div>
            <h2 className="heading">{ profile.firstName } { profile.lastName }</h2>
          </div>
        }
      </div>
    </>
  )
}

export default Profile;
