import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

export async function loginWithCredentials(username, password) {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login falhou');
  const { token } = await res.json();
  return token;
}

export async function exchangeCodeForToken(code, client_id) {
  const res = await fetch('http://localhost:3000/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, client_id }),
  });
  if (!res.ok) throw new Error('Falha ao trocar código por token');
  const data = await res.json();
  return data.access_token;
}
