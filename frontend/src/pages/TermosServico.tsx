import React, { useEffect, useState } from 'react';

interface Termo {
  id: number;
  nome: string;
  detalhes: string;
  obrigatorio: boolean;
  aceito: boolean;
  aceito_em?: string;
}

export const TermosServico = () => {
  const [termos, setTermos] = useState<Termo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTerms() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/user/terms-status', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Erro ao buscar termos com status');

        const data: Termo[] = await res.json();
        setTermos(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
        setLoading(false);
      }
    }

    fetchTerms();
  }, []);

  const handleToggle = async (termo: Termo) => {
    if (termo.obrigatorio) {
      // Não permite desmarcar termos obrigatórios
      alert('Este termo é obrigatório e não pode ser desmarcado.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      if (!termo.aceito) {
        // Termo ainda não aceito, vamos aceitar
        const res = await fetch(
          `http://localhost:3000/api/user/terms/${termo.id}/accept`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erro ao aceitar termo');
        }

        // Atualiza o estado local
        setTermos((prev) =>
          prev.map((t) =>
            t.id === termo.id
              ? { ...t, aceito: true, aceito_em: new Date().toISOString() }
              : t
          )
        );
      } else {
        // Termo já aceito, vamos desaceitar
        console.log('Token:', token);
        const res = await fetch(
          `http://localhost:3000/api/user/terms/${termo.id}/unaccept`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erro ao desmarcar termo');
        }

        // Atualiza o estado local
        setTermos((prev) =>
          prev.map((t) =>
            t.id === termo.id ? { ...t, aceito: false, aceito_em: undefined } : t
          )
        );
      }
    } catch (err: any) {
      alert(err.message || 'Erro inesperado');
    }
  };

  if (loading) return <p>Carregando termos...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div style={{ backgroundColor: '#fff', padding: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Termos de Serviço
      </h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Aceito</th>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Descrição</th>
              <th style={thStyle}>Obrigatório</th>
              <th style={thStyle}>Data de Aceite</th>
            </tr>
          </thead>
          <tbody>
            {termos.map((termo) => (
              <tr key={termo.id}>
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={termo.aceito}
                    disabled={termo.obrigatorio}
                    onChange={() => handleToggle(termo)}
                  />
                </td>
                <td style={tdStyle}>{termo.nome}</td>
                <td style={tdStyle}>{termo.detalhes}</td>
                <td style={tdStyle}>{termo.obrigatorio ? 'Sim' : 'Não'}</td>
                <td style={tdStyle}>
                  {termo.aceito_em
                    ? new Date(termo.aceito_em).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '12px',
  backgroundColor: '#f2f2f2',
  fontWeight: 'bold',
  textAlign: 'left',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '12px',
  textAlign: 'left',
};
