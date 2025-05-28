import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Index() {
   const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <img src="cooknow.png" alt="Logo" className="logo" />
        <h2 className="text-logo">CookNow</h2>
      </div>

      <div className="top-bar-center">
        <a href="/index" className="nav-link">Receitas</a>
      </div>

      <div className="top-bar-right">
        <Link to="/food">
          <button><img src="food.png" alt="Food Icon" className="food-top-icon" /></button>
        </Link>
        <Link to="/config">
          <button><img src="user.png" alt="User Icon" className="user-top-icon" /></button>
        </Link>
        <button onClick={handleLogout}>
          <img src="exit.png" alt="Exit Icon" className="exit-top-icon" />
        </button>
      </div>
    </div>

  );
}
