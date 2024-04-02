import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { SignUp } from '../../features/UserFeatures';
import { useAlert } from "react-alert";
import { useDispatch } from 'react-redux';

const RegisterPage = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const handleRegister = (e) => {
    e.preventDefault();
    if (firstName.length < 3 || firstName > 25) {
      alert.error(`first name must be between 3 and 25 characters`);
    } else if (lastName.length < 3 || lastName > 25) {
      alert.error(`last name must be between 3 and 25 characters`);
    } else if (password !== passwordConfirm) {
      alert.error(`password and password confirm doesn't match`);
    } else {
      dispatch(SignUp({ firstName, lastName, email, password }));
    }
  }
  return (
    <>
      <Helmet>
        <title>LiveTalk-register</title>
      </Helmet>
      <div className='container'>
        <form className='auth-form' onSubmit={handleRegister}>
          <h3 className='heading'>register</h3>
          <div className='field multiple'>
            <input type='text' placeholder='first name' onChange={(e) => setFirstName(e.target.value)} required />
            <input type='text' placeholder='last name' onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className='field'>
            <input type='email' placeholder='email' onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className='field'>
            <input type='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className='field'>
            <input type='password' placeholder='re enter password' onChange={(e) => setPasswordConfirm(e.target.value)} required />
          </div>
          <input className='fullwidth' type='submit' value='register' />
          <p>have an account? <Link to='/users/login'>login</Link></p>
        </form>
      </div>
    </>
  )
}

export default RegisterPage;
