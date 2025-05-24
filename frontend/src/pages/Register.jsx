import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    password: '',
    role: 'user'
  });

  const formatCPF = (value) =>
    value.replace(/\D/g, '')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
         .slice(0, 14);

  const formatTelefone = (value) =>
    value.replace(/\D/g, '')
         .replace(/^(\d{2})(\d)/, '($1) $2')
         .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
         .slice(0, 15);

  const isValidCPF = (cpf) => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i)) * (10 - i);
    let check1 = 11 - (sum % 11);
    check1 = check1 >= 10 ? 0 : check1;
    if (check1 !== parseInt(clean.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i)) * (11 - i);
    let check2 = 11 - (sum % 11);
    check2 = check2 >= 10 ? 0 : check2;
    return check2 === parseInt(clean.charAt(10));
  };

  const isValidTelefone = (telefone) => {
    const clean = telefone.replace(/\D/g, '');
    return clean.length === 11;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cpf') newValue = formatCPF(value);
    if (name === 'telefone') newValue = formatTelefone(value);

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidCPF(form.cpf)) {
      alert('CPF inválido!');
      return;
    }

    if (!isValidTelefone(form.telefone)) {
      alert('Telefone inválido! Deve conter 11 dígitos.');
      return;
    }

    try {
      await API.post('/register', form);
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      alert('Erro ao cadastrar: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-azul">Cadastro</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Usuário"
            value={form.username}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-600 hover:text-azul"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="user">Usuário</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-azul text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Cadastrar
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Já tem uma conta?</span>
          <button
            onClick={() => navigate('/login')}
            className="ml-2 text-azul font-semibold hover:underline"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
