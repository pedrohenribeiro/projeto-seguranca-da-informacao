import { useState, useEffect} from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function EditarReceita() {
  const navigate = useNavigate();
  const [receita, setReceita] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const receitaSalva = localStorage.getItem('receitaSelecionada');
    if (receitaSalva) {
      const dados = JSON.parse(receitaSalva);
      setReceita(dados);
      console.log(dados);
      setForm({
        id: dados.id || '',
        nomereceita: dados.nomereceita || '',
        descricao: dados.descricao || '',
        imagem: dados.imagem || '',
        ingredientes: dados.ingredientes || '',
        modopreparo: dados.modopreparo || '',
        rendimento: dados.rendimento || '',
        tempopreparo: dados.tempopreparo || '',
      });

      localStorage.removeItem('receitaSelecionada');
    }
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/receita/${form.id}`, form);
      alert('Receita editada com sucesso!');
      navigate('/index');
    } catch (err) {
      alert('Erro ao editar: ' + (err.response?.data?.error || err.message));
    }
    console.log('Formulário enviado:', form);
  };

  if (!form) return <p className="text-center mt-10">Carregando dados da receita...</p>;

  return (
    <div className="flex justify-center bg-gray-100 py-10">
      <div className="max-w-2xl w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-azul">Editar receita</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nomereceita"
            placeholder="Nome da receita"
            value={form.nomereceita}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
            required
            rows={3}
            maxLength={100}
            className="border p-4 rounded resize-none"
            />
            <p className="text-sm text-gray-500 text-right">{form.descricao.length}/100</p>
            <img src={form.imagem} alt={form.nomereceita} className='modal-image' />
          <input
            type="text"
            name="imagem"
            placeholder="Link da imagem"
            value={form.imagem}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <textarea
            name="ingredientes"
            placeholder="Ingredientes"
            value={form.ingredientes}
            onChange={handleChange}
            required
            rows={5}
            maxLength={500}
            className="border p-4 rounded resize-y"
            />
            <p className="text-sm text-gray-500 text-right">{form.ingredientes.length}/500</p>
          <textarea
            name="modopreparo"
            placeholder="Mode de preparo"
            value={form.modopreparo}
            onChange={handleChange}
            required
            rows={5}
            maxLength={800}
            className="border p-4 rounded resize-y"
            />
            <p className="text-sm text-gray-500 text-right">{form.modopreparo.length}/800</p>
          <input
            type="text"
            name="rendimento"
            placeholder="Rendimento"
            value={form.rendimento}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="tempopreparo"
            placeholder="Tempo de preparo"
            value={form.tempopreparo}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-azul text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Confirmar edição
          </button>
        </form>
      </div>
    </div>
  );
}
