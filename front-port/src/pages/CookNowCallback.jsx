import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function CookNowCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');

    const exchangeCodeForToken = async () => {
      try {
        const res = await axios.post('http://localhost:3000/oauth/token', {
          code,
          client_id: 'cooknow-app',
          redirect_uri: `${window.location.origin}/cooknow/callback`,
          grant_type: 'authorization_code',
        });

        const { access_token } = res.data;

        // Envia o token para a janela principal
        window.opener.postMessage({ token: access_token }, window.location.origin);

        // Fecha a janela pop-up
        window.close();
      } catch (err) {
        console.error('Erro ao trocar code por token:', err);
        alert('Erro ao autenticar com CookNow');
        window.close();
      }
    };

    if (code && state === 'xyz123') {
      exchangeCodeForToken();
    }
  }, [params]);

  return <p>Autenticando com CookNow...</p>;
}
