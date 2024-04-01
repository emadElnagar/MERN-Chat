import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>LiveTalk-register</title>
      </Helmet>
      <div className='container'>
        <form className='auth-form'>
          <h3 className='heading'>register</h3>
          <div className='field multiple'>
            <input type='text' placeholder='first name' required />
            <input type='text' placeholder='last name' required />
          </div>
          <div className='field'>
            <input type='text' placeholder='user name' required />
          </div>
          <div className='field'>
            <input type='password' placeholder='password' required />
          </div>
          <div className='field'>
            <input type='password' placeholder='re enter password' required />
          </div>
          <input className='fullwidth' type='submit' value='register' />
          <p>have an account? <Link to='/users/login'>login</Link></p>
        </form>
      </div>
    </>
  )
}

export default RegisterPage;
