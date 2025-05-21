import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Users from '../pages/Users';

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users" element={<Users />} />
      <Route path="/" element={<h1 className="text-2xl">Bem-vindo à página inicial</h1>} />
    </Routes>
  );
};

export default RoutesApp;
