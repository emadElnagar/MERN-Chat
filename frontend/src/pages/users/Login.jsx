import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";


const LoginPage = () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <Helmet>
        <title>LiveTalk-login</title>
      </Helmet>
      <div className='container'>
        <form className='auth-form'>
          <h3 className='heading'>login</h3>
          <div className='field'>
            <input type="text" placeholder='user name' />
          </div>
          <div className='field password-field'>
            {
              isShow === false 
              ? <BiSolidShow onClick={() => setIsShow(true)} className="password-icon" />
              : <BiSolidHide onClick={() => setIsShow(false)} className="password-icon" />
            }
            <input type={`${isShow === false ? 'password' : 'text'}`} placeholder='password' />
          </div>
          <input className='fullwidth' type='submit' value='login' />
          <p>have no account on LiveTalk ? <Link to='/users/register'>register</Link></p>
        </form>
      </div>
    </>
  )
}

export default LoginPage;
