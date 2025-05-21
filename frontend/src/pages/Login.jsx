import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Login realizado com sucesso!');
      navigate('/users');
    } catch (err) {
      alert('Erro no login: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-azul">Login</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          className="border p-2 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Senha"
          className="border p-2 rounded"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit" className="bg-azul text-white py-2 rounded hover:bg-blue-800 transition">
          Entrar
        </button>
      </form>
    </div>
  );
}
