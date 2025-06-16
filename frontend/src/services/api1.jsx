import axios from 'axios';

const ApiOAuth = axios.create({
  baseURL: 'http://localhost:3000/oauth',
});

ApiOAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default ApiOAuth;
