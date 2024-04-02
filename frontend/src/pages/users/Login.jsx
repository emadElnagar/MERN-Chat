import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Login } from '../../features/UserFeatures';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(Login({ email, password }));
  }
  return (
    <>
      <Helmet>
        <title>LiveTalk-login</title>
      </Helmet>
      <div className='container'>
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
    </>
  )
}

export default LoginPage;
