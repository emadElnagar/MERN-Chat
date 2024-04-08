import { useEffect, useState } from "react"
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"
import { ChagneUserImage, GetSingleUser } from "../../features/UserFeatures";
import UserAvatar from "../../assets/user-avatar.png"
import LoadingScreen from "../../components/LoadingScreen";
import { IoCamera } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile, isLoading } = useSelector((state) => state.user);
  const { id } = useParams();
  const [image, setImage] = useState('');
  useEffect(() => {
    dispatch(GetSingleUser(id));
  }, [dispatch, id]);
  if (! user) {
    navigate("/users/login");
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('file', image);
    dispatch(ChagneUserImage({
      id: user._id,
      formdata
    }));
    setImage('');
    dispatch(GetSingleUser(id));
  }
  return (
    <>
      <Helmet>
        <title>LiveTalk-profile</title>
      </Helmet>
      <div className="container">
        {
          isLoading ? <LoadingScreen /> :
          profile &&
          <div className="img-container">  
            <div className="image">
              <img
                src={`${image ? URL.createObjectURL(image) : profile.image ? 'http://localhost:5000/' + profile.image : UserAvatar}`} 
                alt="user avatar"
                className="profile-img"
              />
              {
                user && user._id === profile._id &&
                <form onSubmit={handleSubmit}>
                  {
                    image ? (
                      <>
                        <button type="submit"><AiOutlineCheck /></button>
                        <button onClick={() => setImage('')}><AiOutlineClose /></button>
                      </>
                    ) : (
                      <>
                        <input type="file" id="img" className="user-img-input" onChange={(e) => setImage(e.target.files[0])} />
                        <label htmlFor="img" className="user-img-label"><IoCamera className="icon" /></label>
                      </>
                    )
                  }
                  
                </form>
              }
            </div>
            <h2 className="heading">{ profile.firstName } { profile.lastName }</h2>
          </div>
        }
      </div>
    </>
  )
}

export default Profile;
