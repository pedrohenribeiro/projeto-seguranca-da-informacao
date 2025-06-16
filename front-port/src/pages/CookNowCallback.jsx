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
        client_id: '0f007095b259aeaef9149aa7e9d61dbb',
        client_secret: '1e577c13fd9320b2576ca4e7bdb1199ef2e3243cdbbc690a471462190c4ded0e',
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
