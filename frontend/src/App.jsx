import './App.css';
import RegisterPage from './pages/users/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/users/register' element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
