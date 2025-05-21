import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-azul text-white flex flex-col p-4 fixed">
      <h1 className="text-2xl font-bold mb-8">Meu App</h1>
      <nav className="flex flex-col gap-4">
        <Link to="/" className="hover:bg-blue-800 p-2 rounded">Home</Link>
        <Link to="/login" className="hover:bg-blue-800 p-2 rounded">Login</Link>
        <Link to="/register" className="hover:bg-blue-800 p-2 rounded">Cadastro</Link>
        <Link to="/users" className="hover:bg-blue-800 p-2 rounded">Usuarios</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
