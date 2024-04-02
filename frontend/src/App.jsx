import './App.css';
import NotFound from './pages/NotFound';
import LoginPage from './pages/users/Login';
import RegisterPage from './pages/users/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/users/login' element={<LoginPage />} />
          <Route path='/users/register' element={<RegisterPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
