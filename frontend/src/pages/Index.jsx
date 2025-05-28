import '../pages/style.css';
import { useState, useEffect, React } from 'react';
import API from '../services/api';

export default function Index() {
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        const response = await API.get('/receitas');
        setReceitas(response.data);
      } catch (error) {
        console.error('Erro ao buscar receitas:', error);
      }
    };

    fetchReceitas();
  }, []);

  return (
    <div className='background'> 
      <h2 className='text'>Venha conhecer nossas deliciosas receitas</h2>

      <div className='contain'>

        {receitas.map((receita) => (
          <div className='card' key={receita.id}>
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
    </div>
  );
}
