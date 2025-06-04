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
    oauthUrl.searchParams.set('state', 'xyz123');

    window.open(
  oauthUrl.toString(),
  'CookNowLogin',
  'width=500,height=600,left=100,top=100'
);

  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Bem-vindo de volta</h1>
        
        <LoginForm onLogin={handleLogin} />

        <div className="my-6 border-t border-gray-300"></div>

        <button
          onClick={handleCookNowLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          Entrar com CookNow
        </button>
      </div>
    </main>
  );
}
