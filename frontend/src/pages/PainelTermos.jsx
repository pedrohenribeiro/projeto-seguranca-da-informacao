import { useEffect, useState } from 'react';
import API from '../services/api';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

export default function PainelTermos() {
  const [termos, setTermos] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [termoEmEdicao, setTermoEmEdicao] = useState(null);
  const [dadosTermo, setDadosTermo] = useState({ nome: '', detalhes: '', obrigatorio: false });

  const carregarTermos = async () => {
    try {
      const res = await API.get('/terms');
      setTermos(res.data);
    } catch (err) {
      alert('Erro ao carregar termos: ' + err.message);
    }
  };

  useEffect(() => {
    carregarTermos();
  }, []);

  const abrirModalAdicionar = () => {
    setTermoEmEdicao(null);
    setDadosTermo({ nome: '', detalhes: '', obrigatorio: false });
    setModalAberta(true);
  };

  const abrirModalEdicao = (termo) => {
    setTermoEmEdicao(termo);
    setDadosTermo({
      nome: termo.nome,
      detalhes: termo.detalhes,
      obrigatorio: termo.obrigatorio,
    });
    setModalAberta(true);
  };

  const salvarTermo = async () => {
    try {
      if (termoEmEdicao) {
        await API.put(`/terms/${termoEmEdicao.id}`, dadosTermo);
      } else {
        await API.post('/terms', dadosTermo);
      }

      setModalAberta(false);
      setDadosTermo({ nome: '', detalhes: '', obrigatorio: false });
      setTermoEmEdicao(null);
      await carregarTermos();
    } catch (err) {
      alert('Erro ao salvar termo: ' + err.message);
    }
  };

  const excluirTermo = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este termo?')) return;

    try {
      await API.delete(`/terms/${id}`);
      await carregarTermos();
    } catch (err) {
      alert('Erro ao excluir termo: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Painel de Termos de Serviço</h2>
          <button
            onClick={abrirModalAdicionar}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Adicionar
          </button>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left text-sm font-semibold">Nome</th>
              <th className="p-3 text-left text-sm font-semibold">Detalhes</th>
              <th className="p-3 text-left text-sm font-semibold">Obrigatório</th>
              <th className="p-3 text-left text-sm font-semibold">Criado em</th>
              <th className="p-3 text-left text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {termos.map((termo) => (
              <tr key={termo.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{termo.nome}</td>
                <td className="p-3 text-gray-700 text-sm">{termo.detalhes}</td>
                <td className="p-3">{termo.obrigatorio ? 'Sim' : 'Não'}</td>
                <td className="p-3">
                  {termo.createdAt
                    ? format(new Date(termo.createdAt), 'dd/MM/yyyy HH:mm')
                    : 'N/A'}
                </td>
                <td className="p-3 space-x-2 flex items-center">
                  <button
                    onClick={() => abrirModalEdicao(termo)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Editar termo"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => excluirTermo(termo.id)}
                    className="text-red-600 hover:text-red-800 transition ml-2"
                    title="Excluir termo"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {termoEmEdicao ? 'Editar Termo' : 'Adicionar Novo Termo'}
            </h3>

            <label className="block mb-3">
              <span className="text-gray-700 font-medium">Nome</span>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                value={dadosTermo.nome}
                onChange={(e) => setDadosTermo({ ...dadosTermo, nome: e.target.value })}
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-medium">Detalhes</span>
              <textarea
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                rows={4}
                value={dadosTermo.detalhes}
                onChange={(e) => setDadosTermo({ ...dadosTermo, detalhes: e.target.value })}
              />
            </label>

            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={dadosTermo.obrigatorio}
                onChange={(e) => setDadosTermo({ ...dadosTermo, obrigatorio: e.target.checked })}
              />
              <span>Termo obrigatório</span>
            </label>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalAberta(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={salvarTermo}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {termoEmEdicao ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
