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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6">
          <h2 className="text-3xl font-bold text-white text-center">Registrar Nova Integração</h2>
          <p className="text-white text-center mt-2">Adicione uma nova aplicação OAuth à sua conta.</p>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-1">Nome do Aplicativo</label>
              <input
                type="text"
                name="name"
                placeholder="Ex: Meu Painel de Vendas"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-1">URIs de Redirecionamento (callback)</label>
              {form.redirect_uris.map((uri, index) => (
                <input
                  key={index}
                  type="url"
                  name="redirect_uris"
                  placeholder="http://localhost:3001/callback"
                  value={uri}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full border border-gray-300 p-3 rounded-md shadow-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-black hover:bg-gray-600 text-white py-3 rounded-md font-semibold shadow-md transition"
            >
              Registrar Aplicação
            </button>
          </form>

          {generatedCredentials && (
            <div className="p-4 bg-green-100 border border-green-400 rounded-md shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-green-800">Credenciais Geradas</h3>
              <p className="text-sm text-gray-800"><strong>Client ID:</strong> {generatedCredentials.client_id}</p>
              <p className="text-sm text-gray-800"><strong>Client Secret:</strong> {generatedCredentials.client_secret}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthClientRegister;
