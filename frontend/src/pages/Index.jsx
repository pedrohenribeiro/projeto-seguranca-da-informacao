import { useEffect, useState } from 'react';
import API from '../services/api';
import '../pages/style.css';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";

export default function Index() {
  const [alertaTermos, setAlertaTermos] = useState(false);
  const [mensagemTermos, setMensagemTermos] = useState('');
  const [receitas, setReceitas] = useState([]);
  const [comunicacoesPromocionaisAtivas, setComunicacoesPromocionaisAtivas] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false);

  useEffect(() => {
    // Carregar receitas
    const fetchReceitas = async () => {
      try {
        const response = await API.get('/receitas');
        setReceitas(response.data);
      } catch (error) {
        console.error('Erro ao buscar receitas:', error);
      }
    };

    console.log(receitaSelecionada + "receitaSelec");

    fetchReceitas();

    // Verifica alerta de termos salvo no localStorage
    const alerta = localStorage.getItem('alertaNovosTermos');
    const msg = localStorage.getItem('mensagemTermos');
    if (alerta === 'true' && msg) {
      setAlertaTermos(true);
      setMensagemTermos(msg);
    }

    // Verificar se o usuário aceitou o termo de comunicações promocionais (ID 14)
const verificarTermos = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await API.get('/user', {  // aqui trocou de '/me' para '/user'
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const termosAceitos = response.data.termosAceitos || [];
          const aceitouPromocionais = termosAceitos.includes(14);
          setComunicacoesPromocionaisAtivas(aceitouPromocionais);
        } catch (error) {
          console.error('Erro ao verificar termos aceitos:', error);
        }
      };


    verificarTermos();
  }, []);

const deleteReceita = async (ReceitaId) => {
  try {
    const response = await API.delete(`/receita/${ReceitaId}`);
    alert('Receita deletada com sucesso!');
    window.location.href = '/index';
  } catch (error) {
    console.error('Erro ao deletar receita:', error);
  }
};

const fecharAlerta = () => {
  setAlertaTermos(false);
  localStorage.removeItem('alertaNovosTermos');
  localStorage.removeItem('mensagemTermos');
};

  const abrirModal = (receita) => {
    setReceitaSelecionada(receita);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setReceitaSelecionada(null);
    setModalAberto(false);
  };

  const fecharModalDelete = () => {
    setModalDeleteAberto(false);
  };

  return (
    <div className='background'>
      {alertaTermos && (
        <div
          style={{
            background: '#fffae6',
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
            border: '1px solid #ffecb3',
            color: '#665c00',
            fontWeight: 'bold',
            position: 'relative',
          }}
          role="alert"
          aria-live="assertive"
        >
          ⚠️ {mensagemTermos}
          <button
            onClick={fecharAlerta}
            style={{
              position: 'absolute',
              right: 10,
              top: 8,
              background: 'transparent',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#665c00',
              fontSize: 16,
            }}
            aria-label="Fechar alerta"
            title="Fechar alerta"
          >
            ×
          </button>
        </div>
      )}

      {comunicacoesPromocionaisAtivas ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          ✅ Você está inscrito para comunicações promocionais!
        </p>
      ) : (
        <p style={{ color: '#0077cc', fontWeight: 'bold' }}>
          📭 Deseja ativar comunicações promocionais?
        </p>
      )}

      <h2 className='text'>Venha conhecer nossas deliciosas receitas</h2>

      <div className='contain'>
        {receitas.map((receita) => (
          <div className='card' 
          key={receita.id}
          onClick={() => abrirModal(receita)}>
            <div className='card-top'>
              <img src={receita.imagem} alt={receita.nomereceita} className='image-card' />
            </div>
            <div className='card-bottom'>
              <h3 className='card-title'>{receita.nomereceita}</h3>
              <p className='card-description'>{receita.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal da receita selecionada */}
      {modalAberto && receitaSelecionada && (
        <div className='modal-overlay' onClick={fecharModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className='modal-close' onClick={fecharModal}>X</button>
            <div className='modal-title'>{receitaSelecionada.nomereceita}</div>
            <img src={receitaSelecionada.imagem} alt={receitaSelecionada.nomereceita} className='modal-image' />
            <p className='modal-text'>
              <strong>Descrição:</strong> {receitaSelecionada.descricao}</p>
            <p className='modal-text'><strong>Ingredientes:</strong> <div className='pre'>{receitaSelecionada.ingredientes}</div></p>
            <p className='modal-text'><strong>Modo de preparo:</strong> <pre>{receitaSelecionada.modopreparo}</pre></p>
            <p className='modal-text'><strong>Rendimento:</strong> {receitaSelecionada.rendimento}</p>
            <p className='modal-text'><strong>Tempo de preparo:</strong> {receitaSelecionada.tempopreparo}</p>
            <div className="flex justify-between items-center mt-8">
            <button
              className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
              onClick={fecharModal}
              >
                <FaArrowLeft />
                <span>Voltar</span>
              </button>
              <div className="flex justify-end">
                <button
                  onClick={() => setModalDeleteAberto(true)}
                  className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition shadow-md"
                >
                  <MdDelete />
                  <span>Deletar</span>
                </button>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem('receitaSelecionada', JSON.stringify(receitaSelecionada));
                  window.location.href = '/editarReceita';
                }}
                className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition shadow-md"
              >
                <FaSave />
                <span>Editar</span>
              </button>
            </div>          
          </div>
        </div>
      )}

      {/* Modal para deletar receita */}
      {modalDeleteAberto && (
        <div className='modal-overlay' onClick={fecharModalDelete}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className='modal-close' onClick={fecharModalDelete}>X</button>
            <p className='modal-text'>Tem certeza que deseja DELETAR a receita de {receitaSelecionada.nomereceita}?</p>
            <div className="flex justify-between items-center mt-8">
            <button
              className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
              onClick={fecharModalDelete}
              >
                <FaArrowLeft />
                <span>Cancelar</span>
              </button>
              <div className="flex justify-end">
                <button
                  onClick={() => deleteReceita(receitaSelecionada.id)}
                  className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition shadow-md"
                >
                  <MdDelete />
                  <span>Confirmar</span>
                </button>
              </div>
            </div>          
          </div>
        </div>
      )}
    </div>
  );
}
