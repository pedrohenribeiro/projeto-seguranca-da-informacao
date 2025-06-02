import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 300, margin: 'auto' }}>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <button type="submit" style={{ width: '100%', padding: '8px' }}>
        Entrar
      </button>
    </form>
  );
}
