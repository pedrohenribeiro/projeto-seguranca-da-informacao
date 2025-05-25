import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Portabilidade() {
  const [user, setUser] = useState(null);
  const [dataOption, setDataOption] = useState('personal'); // 'personal' or 'personalAndAddress'
  const [destino, setDestino] = useState('');
  const [consentimento, setConsentimento] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Sample list of companies for the dropdown
  const companies = [
    'Empresa A',
    'Empresa B',
    'Empresa C',
    'Outra'
  ];

  useEffect(() => {
    API.get('/user')
      .then(res => setUser(res.data))
      .catch(() => setMensagem('Erro ao carregar dados do usuário.'));
  }, []);

  const handleEnviar = async () => {
    if (!consentimento) {
      alert('Você deve autorizar a portabilidade dos dados.');
      return;
    }
    if (!destino) {
      alert('Selecione uma empresa de destino.');
      return;
    }

    const dadosSelecionados = {};
    const personalFields = ['name', 'email', 'cpf', 'phone'];
    const addressFields = ['street', 'neighborhood', 'city', 'number', 'zipcode'];

    // Select fields based on dataOption
    const fieldsToPort = dataOption === 'personal' ? personalFields : [...personalFields, ...addressFields];

    fieldsToPort.forEach(field => {
      if (user && user[field] && field !== 'password') {
        dadosSelecionados[field] = user[field];
      }
    });

    try {
      setEnviando(true);
      await fetch('https://sua-api-externa.com/portabilidade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destino,
          dados: dadosSelecionados,
        }),
      });
      setMensagem('Dados enviados com sucesso!');
    } catch (error) {
      setMensagem('Erro ao enviar os dados.');
    } finally {
      setEnviando(false);
    }
  };

  // Format field names for display
  const formatFieldName = (key) => {
    const fieldNames = {
      name: 'Nome',
      email: 'E-mail',
      cpf: 'CPF',
      phone: 'Telefone',
      street: 'Rua',
      neighborhood: 'Bairro',
      city: 'Cidade',
      number: 'Número',
      zipcode: 'CEP',
      password: 'Senha',
    };
    return fieldNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        Solicitação de Portabilidade de Dados
      </h1>

      <p className="text-gray-600 mb-8 text-lg text-center max-w-2xl mx-auto">
        De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem o direito de solicitar a transferência de seus dados pessoais para outro fornecedor de serviço ou produto.
      </p>

      {user ? (
        <div className="bg-white shadow-lg rounded-xl p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quais dados você deseja portar?</h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <input
                  type="radio"
                  name="dataOption"
                  value="personal"
                  checked={dataOption === 'personal'}
                  onChange={() => setDataOption('personal')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-gray-800 font-medium">Apenas dados pessoais</span>
                  <span className="text-gray-600 ml-2">(Nome, E-mail, CPF, Telefone)</span>
                </div>
              </label>
              <label className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <input
                  type="radio"
                  name="dataOption"
                  value="personalAndAddress"
                  checked={dataOption === 'personalAndAddress'}
                  onChange={() => setDataOption('personalAndAddress')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-gray-800 font-medium">Dados pessoais e endereço</span>
                  <span className="text-gray-600 ml-2">(Nome, E-mail, CPF, Telefone, Rua, Bairro, Cidade, Número, CEP)</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Selecione a empresa de destino
            </label>
            <select
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma empresa</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                checked={consentimento}
                onChange={() => setConsentimento(!consentimento)}
              />
              <span className="ml-3 text-gray-700">
                Autorizo expressamente a portabilidade dos dados selecionados.
              </span>
            </label>
          </div>

          <button
            disabled={enviando}
            onClick={handleEnviar}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? 'Enviando...' : 'Solicitar Portabilidade'}
          </button>

          {mensagem && (
            <div className={`text-center mt-4 text-sm ${mensagem.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
              {mensagem}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          <p className="text-gray-500 mt-4">Carregando dados do usuário...</p>
        </div>
      )}
    </div>
  );
}