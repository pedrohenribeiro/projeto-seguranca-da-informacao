import { useEffect, useState } from 'react';
import API from '../services/api';
import '../pages/style.css';

export default function Index() {
  const [alertaTermos, setAlertaTermos] = useState(false);
  const [mensagemTermos, setMensagemTermos] = useState('');
  const [receitas, setReceitas] = useState([]);
  const [comunicacoesPromocionaisAtivas, setComunicacoesPromocionaisAtivas] = useState(false);

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

  // Função para fechar o alerta e limpar localStorage
  const fecharAlerta = () => {
    setAlertaTermos(false);
    localStorage.removeItem('alertaNovosTermos');
    localStorage.removeItem('mensagemTermos');
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