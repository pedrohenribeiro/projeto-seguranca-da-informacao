import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiOauth from '../services/api1';


const MinhasIntegracoes = () => {
  const [tipo, setTipo] = useState(null);
  const [dados, setDados] = useState([]);
  const [revogarId, setRevogarId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarIntegracoes();
  }, []);

  const carregarIntegracoes = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await ApiOauth.get('/integracoes');
      setTipo(response.data.tipo);
      setDados(response.data.apps || response.data.integracoes || []);
    } catch (err) {
      console.error('Erro ao buscar integrações:', err);
      alert('Erro ao carregar integrações');
    }
  };

  const abrirModalRevogar = (id) => {
    setRevogarId(id);
    setShowModal(true);
  };

  const cancelarRevogacao = () => {
    setRevogarId(null);
    setShowModal(false);
  };

  const confirmarRevogacao = async () => {
    if (!revogarId) return;

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      await ApiOauth.delete(`/integracoes/${revogarId}`);

      setDados(prev => prev.filter(item => item.client_id !== revogarId));
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao revogar acesso:', err);
      alert('Erro ao revogar o acesso.');
    } finally {
      setLoading(false);
      setRevogarId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6">
          <h2 className="text-3xl font-bold text-white text-center">Minhas Integrações</h2>
          <p className="text-white text-center mt-2">Gerencie os acessos conectados à sua conta.</p>
        </div>

        <div className="p-8">
            {tipo === 'empresa' && (
                <div className="mb-6 text-right">
                <a
                    href="/oauth/clientRegister"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                >
                    + Adicionar Integração
                </a>
                </div>
            )}
          {tipo === null ? (
            <p className="text-center text-gray-600 text-lg">Carregando...</p>
          ) : dados.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">Você ainda não possui integrações registradas.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tipo === 'empresa' ? dados.map(app => (
                <div key={app.client_id} className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200">
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">{app.name}</h2>
                  <p className="text-sm text-gray-700 break-all">
                    <span className="font-medium">Client ID:</span>{" "}
                    <code className="bg-gray-200 px-1 rounded inline-block max-w-full overflow-hidden text-ellipsis">
                      {app.client_id}
                    </code>
                  </p>
                  <p className="text-sm text-gray-700 break-all">
                    <span className="font-medium">Client Secret:</span>{" "}
                    <code className="bg-gray-200 px-1 rounded inline-block max-w-full overflow-hidden text-ellipsis">
                      {app.client_secret}
                    </code>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">URIs:</span>{" "}
                    {app.redirect_uris.join(', ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Criado em: {new Date(app.createdAt).toLocaleString()}</p>
                  <button
                    onClick={() => abrirModalRevogar(app.client_id)}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold shadow-sm transition"
                  >
                    Revogar acesso
                  </button>
                </div>
              )) : dados.map((grant, idx) => (
                <div key={idx} className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200">
                  <h2 className="text-xl font-semibold text-green-700 mb-2">{grant.nomeApp}</h2>
                  <p className="text-xs text-gray-500 mt-2">Concedido em: {new Date(grant.concedido_em).toLocaleString()}</p>
                  <button
                    onClick={() => abrirModalRevogar(grant.client_id)}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold shadow-sm transition"
                  >
                    Revogar acesso
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirmar Revogação</h3>
            <p className="mb-6 text-gray-700">Tem certeza que deseja revogar o acesso desta integração?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelarRevogacao}
                disabled={loading}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRevogacao}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                {loading ? 'Revogando...' : 'Sim, revogar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhasIntegracoes;
