import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const [jwtDecode, setJwtDecode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('jwt-decode').then(module => {
      setJwtDecode(() => module.jwtDecode || module.default || module);
      setLoading(false);
    }).catch(err => {
      console.error('Erro ao importar jwt-decode:', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    if (requiredRole && decoded.role !== requiredRole) {
      return <p>Acesso negado. Você não tem permissão para acessar esta página.</p>;
    }

    return children;
  } catch (err) {
    console.error('Erro ao decodificar token:', err);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
