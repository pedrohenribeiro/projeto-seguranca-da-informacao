import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { loginWithCredentials } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async ({ username, password }) => {
    try {
      const token = await loginWithCredentials(username, password);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch {
      alert('Falha no login');
    }
  };

  const handleCookNowLogin = () => {
    const clientId = 'cooknow-app';
    const redirectUri = `${window.location.origin}/cooknow/callback`;
    const oauthUrl = new URL('http://localhost:3000/oauth/authorize');
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('scope', 'read');
    oauthUrl.searchParams.set('state', 'xyz123'); // opcional: gerar dinamicamente no futuro

    // Redireciona para o provedor OAuth
    window.location.href = oauthUrl.toString();
  };

  return (
    <main>
      <LoginForm onLogin={handleLogin} />
      <hr />
      <button onClick={handleCookNowLogin} style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}>
        Entrar com CookNow
      </button>
    </main>
  );
}
