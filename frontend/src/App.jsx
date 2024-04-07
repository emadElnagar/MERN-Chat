import './App.css';
import NotFound from './pages/NotFound';
import LoginPage from './pages/users/Login';
import Profile from './pages/users/Profile';
import RegisterPage from './pages/users/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/users/login' element={<LoginPage />} />
          <Route path='/users/register' element={<RegisterPage />} />
          <Route path='/users/profile/:id' element={<Profile />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
