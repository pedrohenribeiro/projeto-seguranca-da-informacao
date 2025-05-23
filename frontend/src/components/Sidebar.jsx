import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      className={`h-screen bg-black text-white flex flex-col p-4 fixed transition-all duration-300 ease-in-out ${
        isHovered ? 'w-64' : 'w-12'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h1
        className={`text-2xl font-bold mb-8 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Meu App
      </h1>

      <nav className="flex flex-col gap-4">
        <Link
          to="/index"
          className={`p-2 rounded transition-opacity duration-300 ${
            isHovered ? 'opacity-100 hover:bg-gray-800' : 'opacity-0'
          }`}
        >
          Home
        </Link>
        <Link
          to="/config"
          className={`p-2 rounded transition-opacity duration-300 ${
            isHovered ? 'opacity-100 hover:bg-gray-800' : 'opacity-0'
          }`}
        >
          Configurações
        </Link>
      </nav>

      {/* Botão de sair */}
      <button
        onClick={handleLogout}
        className={`mt-auto p-2 text-left rounded transition-opacity duration-300 ${
          isHovered ? 'opacity-100 hover:bg-gray-800' : 'opacity-0'
        }`}
      >
        Sair
      </button>
    </div>
  );
};

export default Sidebar;
