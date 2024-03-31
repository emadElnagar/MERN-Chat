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
            <input placeholder='first name' />
            <input placeholder='last name' />
          </div>
          <div className='field'>
            <input placeholder='user name' />
          </div>
          <div className='field'>
            <input placeholder='password' />
          </div>
          <div className='field'>
            <input placeholder='re enter password' />
          </div>
          <input className='fullwidth' type='submit' value='submit' />
          <p>have an account? <Link to='/users/login'>login</Link></p>
        </form>
      </div>
    </>
  )
}

export default RegisterPage;
