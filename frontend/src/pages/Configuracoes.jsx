import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaUserEdit, FaTrashAlt, FaSignOutAlt, FaExchangeAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const formatarCPF = (cpf) => {
  if (!cpf) return 'Não informado';
  cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cpf.length > 11) cpf = cpf.slice(0, 11); // Limita a 11 dígitos
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatarTelefone = (telefone) => {
  if (!telefone) return 'Não informado';
  telefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (telefone.length > 11) telefone = telefone.slice(0, 11); // Limita a 11 dígitos
  if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
};


const validarCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, ''); 
  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
};

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarTelefone = (telefone) => {
  telefone = telefone.replace(/\D/g, '');
  return telefone.length === 10 || telefone.length === 11;
};

export default function Configuracoes() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [erros, setErros] = useState({ cpf: '', email: '', telefone: '' });
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();

  const fecharModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    API.get('/user')
      .then((res) => {
        const userData = res.data;
        setUser(userData);

        const novosErros = { cpf: '', email: '', telefone: '' };
        if (userData.cpf) {
          const cpfLimpo = userData.cpf.replace(/\D/g, '');
          if (cpfLimpo.length !== 11) {
            novosErros.cpf = 'CPF deve ter 11 caracteres';
          } else if (!validarCPF(userData.cpf)) {
            novosErros.cpf = 'CPF inválido';
          }
        }
        if (userData.email && !validarEmail(userData.email)) {
          novosErros.email = 'Email inválido';
        }
        if (userData.telefone) {
          const telefoneLimpo = userData.telefone.replace(/\D/g, '');
          if (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11) {
            novosErros.telefone = 'Telefone deve ter 10 ou 11 dígitos';
          } else if (!validarTelefone(userData.telefone)) {
            novosErros.telefone = 'Telefone inválido';
          }
        }
        setErros(novosErros);

        setIsLoading(false);
      })
      .catch((err) => {
        alert('Erro ao carregar dados do usuário: ' + err.message);
        setIsLoading(false);
      });
  }, []);

  const navigationItems = [
    { icon: <FaUserEdit />, label: 'Editar Informações Pessoais', path: '/perfil/editar' },
    { icon: <FaTrashAlt />, label: 'Deletar Informações Pessoais', onClick: () => setIsModalOpen(true) },  
    { icon: <FaExchangeAlt />, label: 'Fazer Portabilidade', path: '/perfil/portabilidade' },
  ];
  
    const handleLogout = () => {
      logout();
      localStorage.removeItem('token');
      navigate('/login');
    };

  const handleDelete = async () => {  
      try {
        await API.delete('/user');
        alert('Seu usuário foi deletado com sucesso!');
        handleLogout();
      } catch (err) {
        alert('Erro ao cadastrar: ' + (err.response?.data?.error || err.message));
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6">
          <h2 className="text-3xl font-bold text-white text-center">Olá, bem-vindo(a)!</h2>
          <p className="text-white text-center mt-2">Gerencie sua conta de forma rápida e segura.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900"></div>
          </div>
        ) : user ? (
          <div className="p-8">
            {/* Informações do Usuário */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                Informações do Usuário
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Nome</p>
                  <p className="text-lg text-gray-800">{user.nome || 'Não informado'}</p>
                  {erros.email && (
                    <span className="text-red-500 text-sm mt-1 block">{erros.nome}</span>
                  )}
                </div>

                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Email</p>
                  <p className="text-lg text-gray-800">{user.email || 'Não informado'}</p>
                  {erros.email && (
                    <span className="text-red-500 text-sm mt-1 block">{erros.email}</span>
                  )}
                </div>

                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">CPF</p>
                  <p className="text-lg text-gray-800">{formatarCPF(user.cpf)}</p>
                  {erros.cpf && (
                    <span className="text-red-500 text-sm mt-1 block">{erros.cpf}</span>
                  )}
                </div>

                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Telefone</p>
                  <p className="text-lg text-gray-800">{formatarTelefone(user.telefone)}</p>
                  {erros.telefone && (
                    <span className="text-red-500 text-sm mt-1 block">{erros.telefone}</span>
                  )}
                </div>
              </div>
            </div>


            {/* Navigation Buttons */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Gerenciar Conta</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.onClick ? item.onClick : () => navigate(item.path)}
                    className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm transition"
                  >
                    <span className="text-gray-900 text-xl">{item.icon}</span>
                    <span className="text-gray-800 font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout Button */}
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition shadow-md"
              >
                <FaSignOutAlt />
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 p-8">Não foi possível carregar as informações do usuário.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={fecharModal} className="modal-close">✖</button>
            <h2 className="modal-title">Confirmar Exclusão</h2>
            <p className="modal-text">
              Tem certeza de que deseja deletar suas informações pessoais? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={fecharModal} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}