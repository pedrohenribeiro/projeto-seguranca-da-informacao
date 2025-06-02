import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const client_id = params.get('client_id');
  const redirect_uri = params.get('redirect_uri');
  const scope = params.get('scope') || 'informações básicas';
  const state = params.get('state');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/oauth/authorize', {
        email,
        password,
        client_id,
        redirect_uri,
        state,
      });

      if (res.request.responseURL) {
        window.location.href = res.request.responseURL;
      }
    } catch (err) {
      setError('Credenciais inválidas ou erro na autorização');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#f97316' }}>CookNow - Autorização</h2>
      <p><strong>{client_id}</strong> está solicitando acesso à sua conta.</p>
      <p>Permissões: <em>{scope}</em></p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginTop: 12, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginTop: 12, padding: 8 }}
        />
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
        <button
          type="submit"
          style={{
            backgroundColor: '#f97316',
            color: '#fff',
            padding: '10px',
            width: '100%',
            marginTop: 16,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Permitir acesso
        </button>
      </form>
    </div>
  );
}
