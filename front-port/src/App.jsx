import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CookNowCallback from './pages/CookNowCallback';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<h1>Bem-vindo!</h1>} />
        <Route path="/cooknow/callback" element={<CookNowCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
