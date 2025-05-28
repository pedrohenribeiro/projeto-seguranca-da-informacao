import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterFood() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nomereceita: '',
    descricao: '',
    imagem: '',
    ingredientes: '',
    modopreparo: '',
    rendimento: '',
    tempopreparo: '',
  });

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
      await API.post('/register', form);
      alert('Cadastro de receita realizado com sucesso!');
      navigate('/index');
    } catch (err) {
      alert('Erro ao cadastrar: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 py-10">
      <div className="max-w-2xl w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-azul">Cadastro de receita</h2>
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
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
