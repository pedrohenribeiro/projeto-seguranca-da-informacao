import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import API from '../services/api';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: '',
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    password: '',
    role: 'user',
  });

  const [aceiteTodosTermos, setAceiteTodosTermos] = useState(false);
  const [termosDoBanco, setTermosDoBanco] = useState([]);
  const [termosIndividuais, setTermosIndividuais] = useState({});
  const [modalAberta, setModalAberta] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/index');
    }

    const fetchTerms = async () => {
      try {
        const response = await API.get('/terms');
        setTermosDoBanco(response.data);

        const termosCheckbox = Object.fromEntries(
          response.data.map(t => [t.id, false])
        );
        setTermosIndividuais(termosCheckbox);
      } catch (err) {
        console.error('Erro ao buscar termos:', err);
        alert('Erro ao carregar termos de serviço.');
      }
    };

    fetchTerms();
  }, [isAuthenticated, navigate]);

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

  const handleAceitePrincipal = () => {
    const novoValor = !aceiteTodosTermos;
    setAceiteTodosTermos(novoValor);
    const novosTermos = Object.fromEntries(
      termosDoBanco.map(t => [t.id, novoValor])
    );
    setTermosIndividuais(novosTermos);
  };

  const handleTermoIndividual = (id) => {
    const novos = { ...termosIndividuais, [id]: !termosIndividuais[id] };
    setTermosIndividuais(novos);
    const todosMarcados = Object.entries(novos).every(([termId, marcado]) => {
      const termo = termosDoBanco.find(t => t.id === parseInt(termId));
      return !termo?.obrigatorio || marcado;
    });
    setAceiteTodosTermos(todosMarcados);
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

    const obrigatoriosAceitos = termosDoBanco.every(t => {
      return !t.obrigatorio || termosIndividuais[t.id];
    });

    if (!obrigatoriosAceitos) {
      alert('Você deve aceitar todos os termos obrigatórios.');
      return;
    }

    try {
      await API.post('/register', {
        ...form,
        termosAceitos: Object.entries(termosIndividuais)
          .filter(([, aceito]) => aceito)
          .map(([id]) => parseInt(id)),
      });
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      alert('Erro ao cadastrar: ' + (err.response?.data?.message || err.response?.data?.error || err.message));
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

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={aceiteTodosTermos}
              onChange={handleAceitePrincipal}
            />
            Aceito os <button type="button" onClick={() => setModalAberta(true)} className="text-blue-600 underline">Termos de Uso</button>
          </label>

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

      <Modal isOpen={modalAberta} onRequestClose={() => setModalAberta(false)}>
        <h3 className="text-xl font-bold mb-4">Termos de Uso</h3>
        <div className="space-y-4">
          {termosDoBanco.map((termo) => (
            <div key={termo.id} className="mb-3">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={termosIndividuais[termo.id] || false}
                  onChange={() => handleTermoIndividual(termo.id)}
                  disabled={termo.obrigatorio && termosIndividuais[termo.id]}
                />
                <div>
                  <strong>{termo.nome}</strong>
                  <p className="text-sm text-gray-600">{termo.detalhes}</p>
                  {termo.obrigatorio && (
                    <p className="text-xs text-red-500 italic">(Obrigatório)</p>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={() => setModalAberta(false)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Fechar
        </button>
      </Modal>
    </div>
  );
}
