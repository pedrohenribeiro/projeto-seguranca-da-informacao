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
          client_id: '3b80c0a6e64580fe59b6f7d96cb7d35e',
          client_secret: 'f3f0c8adecf06902fa09b220d157bac93d9c4a315af15ce21cf3511d7827cc0b', 
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

    if (code && state === 'xyz123') {
      exchangeCodeForToken();
    }
  }, [params]);

  return <p>Autenticando com CookNow...</p>;
}
