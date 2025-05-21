import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/users')
      .then((res) => setUsers(res.data))
      .catch((err) => alert('Erro ao buscar usuários: ' + err.message));
  }, []);

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
