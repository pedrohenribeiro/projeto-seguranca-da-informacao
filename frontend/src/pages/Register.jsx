import { useState } from 'react';
import API from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    telefone: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/register', form);
      alert('Cadastro realizado com sucesso!');
      navigate('/users');
    } catch (err) {
      alert('Erro ao cadastrar: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Cadastro</h2>

        <input
          name="username"
          placeholder="Usuário"
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="telefone"
          placeholder="Telefone"
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="role"
          onChange={handleChange}
          className="w-full mb-6 p-3 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">Usuário</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition duration-300"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
