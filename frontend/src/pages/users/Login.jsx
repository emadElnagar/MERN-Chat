import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Login } from '../../features/UserFeatures';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorBox from "../../components/ErrorBox";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, isLoading, error } = useSelector((state) => state.user);
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(Login({ email, password }));
  }
  if (user) {
    navigate('/');
  }
  return (
    <>
      <Helmet>
        <title>LiveTalk-login</title>
      </Helmet>
      {
        isLoading === true ? <LoadingScreen /> :
        <div className='container'>
          {
            error && (<ErrorBox message={'Invalid email or password'} />)
          }
          <form className='auth-form' onSubmit={handleLogin}>
            <h3 className='heading'>login</h3>
            <div className='field'>
              <input type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className='field password-field'>
              {
                isShow === false 
                ? <BiSolidShow onClick={() => setIsShow(true)} className="password-icon" />
                : <BiSolidHide onClick={() => setIsShow(false)} className="password-icon" />
              }
              <input type={`${isShow === false ? 'password' : 'text'}`} placeholder='password' onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <input className='fullwidth' type='submit' value='login' />
            <p>have no account on LiveTalk ? <Link to='/users/register'>register</Link></p>
          </form>
        </div>
      }
    </>
  )
}

export default LoginPage;
