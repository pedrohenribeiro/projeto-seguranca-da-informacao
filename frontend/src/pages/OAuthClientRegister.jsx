import React, { useState } from 'react';
import ApiOAuth from '../services/api1';

const OAuthClientRegister = () => {
  const [form, setForm] = useState({
    name: '',
    redirect_uris: [''],
  });

  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === 'redirect_uris' && index !== undefined) {
      const updatedURIs = [...form.redirect_uris];
      updatedURIs[index] = value;
      setForm({ ...form, redirect_uris: updatedURIs });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addRedirectUriField = () => {
    setForm({ ...form, redirect_uris: [...form.redirect_uris, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ApiOAuth.post('/apps', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // ou da forma que você salva o token
        },
      });
      setGeneratedCredentials(response.data);
      alert('Aplicação registrada com sucesso!');
      setForm({ name: '', redirect_uris: [''] });
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar aplicação');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Registrar Nova Integração OAuth</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nome do Aplicativo</label>
          <input
            type="text"
            name="name"
            placeholder="Ex: Meu Painel de Vendas"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">URIs de Redirecionamento (callback)</label>
          {form.redirect_uris.map((uri, index) => (
            <input
              key={index}
              type="url"
              name="redirect_uris"
              placeholder="http://localhost:3001/callback"
              value={uri}
              onChange={(e) => handleChange(e, index)}
              className="w-full border p-2 rounded mb-2"
              required
            />
          ))}
          <button
            type="button"
            onClick={addRedirectUriField}
            className="text-sm text-blue-600 hover:underline"
          >
            + Adicionar outro URI
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Registrar Aplicação
        </button>
      </form>

      {generatedCredentials && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-bold text-lg mb-2">Credenciais Geradas</h3>
          <p><strong>Client ID:</strong> {generatedCredentials.client_id}</p>
          <p><strong>Client Secret:</strong> {generatedCredentials.client_secret}</p>
        </div>
      )}
    </div>
  );
};

export default OAuthClientRegister;
