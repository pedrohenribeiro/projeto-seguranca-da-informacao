import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import API from '../services/api';
export default function DeleteAccount() {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja apagar sua conta e todos os seus dados? Esta ação não pode ser desfeita.'
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await API.delete('/user');
      alert('Conta deletada com sucesso.');
      // Remove o token antes de forçar o redirecionamento
      localStorage.removeItem('token');
      // Força o navegador a carregar a rota de login diretamente
      window.location.replace('/login');
    } catch (err) {
      console.error('Erro ao deletar conta:', err.response?.data || err.message);
      alert('Falha ao deletar conta. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Apagar Conta</h2>
        <p className="text-gray-600 mb-6">
          Clique no botão abaixo para apagar sua conta e todos os seus dados.
        </p>
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`flex items-center justify-center w-full space-x-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
          } bg-red-600 text-white px-6 py-3 rounded-lg transition shadow-md`}
        >
          <FaTrash />
          <span>{loading ? 'Apagando...' : 'Apagar Conta'}</span>
        </button>
      </div>
    </div>
  );
}
