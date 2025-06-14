import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const formatarCPF = (value) => {
  if (!value) return '';
  const cpf = value.replace(/\D/g, '').slice(0, 11); // Limita a 11 dígitos
  return cpf.replace(/(\d{3})(\d{3})?(\d{3})?(\d{2})?/, (match, p1, p2, p3, p4) => {
    let result = p1;
    if (p2) result += `.${p2}`;
    if (p3) result += `.${p3}`;
    if (p4) result += `-${p4}`;
    return result;
  });
};

const formatarTelefone = (value) => {
  if (!value) return '';
  const telefone = value.replace(/\D/g, '').slice(0, 11); // Limita a 11 dígitos
  if (telefone.length <= 10) {
    return telefone.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
      let result = `(${p1}`;
      if (p2) result += `) ${p2}`;
      if (p3) result += `-${p3}`;
      return result;
    });
  }
  return telefone.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (match, p1, p2, p3) => {
    let result = `(${p1}`;
    if (p2) result += `) ${p2}`;
    if (p3) result += `-${p3}`;
    return result;
  });
};

const formatarCEP = (value) => {
  if (!value) return '';
  const cep = value.replace(/\D/g, '').slice(0, 8); // Limita a 8 dígitos
  return cep.replace(/(\d{5})(\d{0,3})/, (match, p1, p2) => {
    let result = p1;
    if (p2) result += `-${p2}`;
    return result;
  });
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

const validarEstado = (estado) => {
  return estado.length === 2 && /^[A-Z]{2}$/.test(estado);
};

export default function EditarInformacoesPessoais() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cep: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    complemento: '',
  });
  const [erros, setErros] = useState({
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
    estado: '',
    endereco: '',
    bairro: '',
    cidade: '',
    numero: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      API.get('/user').then((res) => res.data),
      API.get('/address').then((res) => res.data).catch(() => ({})),
    ])
      .then(([userData, addressData]) => {
        setFormData({
          nome: userData.nome || '',
          email: userData.email || '',
          telefone: formatarTelefone(userData.telefone || ''),
          cpf: formatarCPF(userData.cpf || ''),
          cep: formatarCEP(addressData.cep || ''),
          endereco: addressData.endereco || '',
          bairro: addressData.bairro || '',
          cidade: addressData.cidade || '',
          estado: addressData.estado || '',
          numero: addressData.numero || '',
          complemento: addressData.complemento || '',
        });
        setIsLoading(false);
      })
      .catch((err) => {
        alert('Erro ao carregar dados: ' + err.message);
        setIsLoading(false);
      });
  }, []);

  console.log('formData:', formData);

  const handleCepChange = async (e) => {
    let cep = e.target.value.replace(/\D/g, '');
    cep = formatarCEP(cep);
    setFormData({ ...formData, cep });

    if (cep.replace(/\D/g, '').length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }));
        } else {
          alert('CEP não encontrado.');
        }
      } catch (err) {
        alert('Erro ao consultar CEP: ' + err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatarCPF(value);
    } else if (name === 'nome') {
      formattedValue = value;
    } else if (name === 'telefone') {
      formattedValue = formatarTelefone(value);
    } else if (name === 'cep') {
      formattedValue = formatarCEP(value);
    } else if (name === 'estado') {
      formattedValue = value.toUpperCase();
    }

    setFormData({ ...formData, [name]: formattedValue });

    const novosErros = { ...erros };
    if (name === 'cpf') {
      const cpfLimpo = value.replace(/\D/g, '');
      novosErros.cpf = cpfLimpo.length !== 11 ? 'CPF deve ter 11 dígitos' : !validarCPF(value) ? 'CPF inválido' : '';
    } else if (name === 'email') {
      novosErros.email = value && !validarEmail(value) ? 'Email inválido' : '';
    } else if (name === 'telefone') {
      const telefoneLimpo = value.replace(/\D/g, '');
      novosErros.telefone =
        telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11 ? 'Telefone deve ter 10 ou 11 dígitos' : '';
    } else if (name === 'cep') {
      const cepLimpo = value.replace(/\D/g, '');
      novosErros.cep = cepLimpo.length !== 8 ? 'CEP deve ter 8 dígitos' : '';
    } else if (name === 'estado') {
      novosErros.estado = value && !validarEstado(value) ? 'Estado deve ter 2 letras maiúsculas' : '';
    } else if (['endereco', 'bairro', 'cidade'].includes(name)) {
      novosErros[name] = value ? '' : `Campo ${name} é obrigatório`;
    } else if (name === 'numero') {
      novosErros.numero = value ? '' : 'Número é obrigatório';
    }
    setErros(novosErros);
  };

  const handleSalvar = async () => {
    const novosErros = {
      cpf: '',
      email: '',
      telefone: '',
      cep: '',
      estado: '',
      endereco: '',
      bairro: '',
      cidade: '',
      numero: '',
    };

    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    const telefoneLimpo = formData.telefone.replace(/\D/g, '');
    const cepLimpo = formData.cep.replace(/\D/g, '');

    if (cpfLimpo && (cpfLimpo.length !== 11 || !validarCPF(formData.cpf))) {
      novosErros.cpf = cpfLimpo.length !== 11 ? 'CPF deve ter 11 dígitos' : 'CPF inválido';
    }
    if (formData.email && !validarEmail(formData.email)) {
      novosErros.email = 'Email inválido';
    }
    if (telefoneLimpo && telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11) {
      novosErros.telefone = 'Telefone deve ter 10 ou 11 dígitos';
    }

    const hasAddressData =
      cepLimpo || formData.endereco || formData.bairro || formData.cidade || formData.estado || formData.numero;
    if (hasAddressData) {
      if (cepLimpo.length !== 8) novosErros.cep = 'CEP deve ter 8 dígitos';
      if (!formData.endereco) novosErros.endereco = 'Endereço é obrigatório';
      if (!formData.bairro) novosErros.bairro = 'Bairro é obrigatório';
      if (!formData.cidade) novosErros.cidade = 'Cidade é obrigatória';
      if (!validarEstado(formData.estado)) novosErros.estado = 'Estado deve ter 2 letras maiúsculas';
      if (!formData.numero) novosErros.numero = 'Número é obrigatório';
    }

    setErros(novosErros);

    if (Object.values(novosErros).some((erro) => erro)) {
      alert('Por favor, corrija os erros antes de salvar.');
      return;
    }

    try {
        await API.put('/user', {
        nome: formData.nome,
        email: formData.email,
        telefone: telefoneLimpo,
        cpf: cpfLimpo,
        });
        console.log('User data updated successfully');

        if (hasAddressData) {
        await API.put('/address', {
            cep: cepLimpo,
            endereco: formData.endereco,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado,
            numero: formData.numero,
            complemento: formData.complemento || undefined,
        });
        console.log('Address data updated successfully');
        }

        alert('Dados atualizados com sucesso!');
        navigate('/config');
    } catch (err) {
        console.error('API Error:', err.response?.status, err.response?.data);
        alert('Erro ao atualizar dados: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6">
          <h2 className="text-3xl font-bold text-white text-center">Editar Informações Pessoais</h2>
          <p className="text-white text-center mt-2">Atualize seus dados pessoais de forma rápida e segura.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900"></div>
          </div>
        ) : (
          <div className="p-8">
            {/* Seção de Informações Pessoais */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="Digite seu nome"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="seu@email.com"
                  />
                  {erros.email && <p className="text-red-500 text-sm mt-1">{erros.email}</p>}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="(XX) 9XXXX-XXXX"
                    maxLength="15"
                  />
                  {erros.telefone && <p className="text-red-500 text-sm mt-1">{erros.telefone}</p>}
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="XXX.XXX.XXX-XX"
                    maxLength="14"
                  />
                  {erros.cpf && <p className="text-red-500 text-sm mt-1">{erros.cpf}</p>}
                </div>
              </div>
            </div>

            {/* Seção de Endereço */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CEP */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleCepChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="XXXXX-XXX"
                    maxLength="9"
                  />
                  {erros.cep && <p className="text-red-500 text-sm mt-1">{erros.cep}</p>}
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="Digite seu endereço"
                  />
                  {erros.endereco && <p className="text-red-500 text-sm mt-1">{erros.endereco}</p>}
                </div>

                {/* Bairro */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="Digite seu bairro"
                  />
                  {erros.bairro && <p className="text-red-500 text-sm mt-1">{erros.bairro}</p>}
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="Digite sua cidade"
                  />
                  {erros.cidade && <p className="text-red-500 text-sm mt-1">{erros.cidade}</p>}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="UF"
                    maxLength="2"
                  />
                  {erros.estado && <p className="text-red-500 text-sm mt-1">{erros.estado}</p>}
                </div>

                {/* Número */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="Digite o número"
                  />
                  {erros.numero && <p className="text-red-500 text-sm mt-1">{erros.numero}</p>}
                </div>

                {/* Complemento */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Complemento</label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    placeholder="Digite o complemento (opcional)"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => navigate('/config')}
                className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
              >
                <FaArrowLeft />
                <span>Voltar</span>
              </button>
              <button
                onClick={handleSalvar}
                className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition shadow-md"
              >
                <FaSave />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}