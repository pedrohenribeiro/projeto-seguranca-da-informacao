import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function CookNowCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

useEffect(() => {
  const code = params.get('code');
  const returnedState = params.get('state');
  const expectedState = sessionStorage.getItem('oauth_state');

  if (!code || returnedState !== expectedState) {
    alert('Tentativa de login inválida ou possivelmente forjada.');
    window.close();
    return;
  }

  const exchangeCodeForToken = async () => {
    try {
      const res = await axios.post('http://localhost:3000/oauth/token', {
        code,
        client_id: 'b2667524e787b80ead554eaa4cf9850e',
        client_secret: 'e28998490e069a039862ccf42be4afa3ae28c162a5b79ce457443bdd15f1605f',
        redirect_uri: `${window.location.origin}/cooknow/callback`,
        grant_type: 'authorization_code',
      });

      const { access_token } = res.data;

      window.opener.postMessage({ token: access_token }, window.location.origin);
      window.close();
    } catch (err) {
      console.error('Erro ao trocar code por token:', err.response?.data || err.message);
      alert('Erro ao autenticar com CookNow');
      window.close();
    }
  };

  exchangeCodeForToken();
}, [params]);

  return <p>Autenticando com CookNow...</p>;
}
