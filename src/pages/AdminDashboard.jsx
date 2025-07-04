import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Opcional: para paginación simple
  const [page, setPage] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('jwtToken');

        const res = await fetch(`/api/admin/logs?page=${page}&limit=${logsPerPage}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError(err.message || 'Error al cargar logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (logs.length === logsPerPage) setPage(page + 1);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Panel de Administración - Logs</h2>

      {loading && <p>Cargando logs...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && logs.length === 0 && <p>No hay logs para mostrar.</p>}

      {!loading && !error && logs.length > 0 && (
        <>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Acción</th>
                <th>Usuario</th>
                <th>Fecha y Hora</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.action}</td>
                  <td>{log.user}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handlePrevPage} disabled={page === 1}>
              Anterior
            </button>
            <span>Página {page}</span>
            <button onClick={handleNextPage} disabled={logs.length < logsPerPage}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
