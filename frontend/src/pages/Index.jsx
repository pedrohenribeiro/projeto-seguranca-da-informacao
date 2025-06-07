import '../pages/style.css';
import { useState, useEffect, React } from 'react';
import API from '../services/api';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

export default function Index() {
  const [receitas, setReceitas] = useState([]);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
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
  }, []);

  const abrirModal = (receita) => {
    setReceitaSelecionada(receita);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setReceitaSelecionada(null);
    setModalAberto(false);
  };

  return (
    <div className='background'> 
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
    </div>
  );
}
