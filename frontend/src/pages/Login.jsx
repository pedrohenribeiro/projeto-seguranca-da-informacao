import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/index');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', form);
      localStorage.setItem('token', res.data.token);

      // Guarda o alerta de termos novos, se existir
      if (res.data.alertaNovosTermos) {
        localStorage.setItem('alertaNovosTermos', 'true');
        localStorage.setItem('mensagemTermos', res.data.mensagem);
      } else {
        localStorage.removeItem('alertaNovosTermos');
        localStorage.removeItem('mensagemTermos');
      }

      login();
      navigate('/index');
    } catch (err) {
      alert('Erro no login: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-azul">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border p-2 rounded"
            value={form.username}
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Senha"
              className="border p-2 rounded w-full pr-10"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-600 hover:text-azul"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="bg-azul text-white py-2 rounded hover:bg-gray-800 transition">
            Entrar
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Não tem uma conta?</span>
          <button
            onClick={() => navigate('/register')}
            className="ml-2 text-azul font-semibold hover:underline"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}
