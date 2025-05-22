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
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-azul">Lista de Usuários</h2>
      {users.length > 0 ? (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="border p-4 rounded hover:bg-gray-50 transition flex justify-between items-center"
            >
              <span className="font-semibold">{user.username}</span>
              <span className="text-gray-600">{user.email}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
      )}
    </div>
  );
}
