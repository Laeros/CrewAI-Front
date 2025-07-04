import React, { useEffect, useState } from 'react';
import { fetchLogs, fetchUsers, updateUserRole, loadAuthToken } from '../services/api';

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorLogs, setErrorLogs] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);
  const [page, setPage] = useState(1);
  const logsPerPage = 20;

  // Cargar token y datos al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadAuthToken();
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.warn('No hay token de autenticación');
        // window.location.href = '/login'; // ← Habilita si quieres forzar redirección
        return;
      }

      loadLogs();
      loadUsers();
    }
  }, [page]);

  const loadLogs = async () => {
    setLoadingLogs(true);
    setErrorLogs(null);
    try {
      const allLogs = await fetchLogs();
      const start = (page - 1) * logsPerPage;
      const end = start + logsPerPage;
      setLogs(allLogs.slice(start, end));
    } catch (err) {
      setErrorLogs(err.message || 'Error al cargar logs');
    } finally {
      setLoadingLogs(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setErrorUsers(err.message || 'Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleAdminRole = async (userId, currentIsAdmin) => {
    try {
      await updateUserRole(userId, !currentIsAdmin);
      loadUsers(); // Refrescar
    } catch (err) {
      alert('Error al cambiar rol del usuario');
      console.error(err);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (logs.length === logsPerPage) setPage(page + 1);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Panel de Administración</h2>

      {/* Usuarios */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Usuarios</h3>
        {loadingUsers ? (
          <p>Cargando usuarios...</p>
        ) : errorUsers ? (
          <p style={{ color: 'red' }}>{errorUsers}</p>
        ) : (
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.is_admin ? 'Administrador' : 'Usuario'}</td>
                  <td>
                    <button onClick={() => toggleAdminRole(user.id, user.is_admin)}>
                      {user.is_admin ? 'Revocar Admin' : 'Hacer Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Logs */}
      <section>
        <h3>Logs del sistema</h3>
        {loadingLogs ? (
          <p>Cargando logs...</p>
        ) : errorLogs ? (
          <p style={{ color: 'red' }}>{errorLogs}</p>
        ) : logs.length === 0 ? (
          <p>No hay logs para mostrar.</p>
        ) : (
          <>
            <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Evento</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{log.event || log.message || 'Sin detalles'}</td>
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
      </section>
    </div>
  );
}
