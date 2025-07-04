import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Logout from './components/Logout';
import './styles/main.css'
import { loadAuthToken } from './services/api';

// Ruta privada: protege MainPage
function PrivateRoute({ children }) {
  const token = localStorage.getItem('jwtToken');
  return token ? children : <Navigate to="/login" />;
}

//Ruta privada solo para admins
function AdminRoute({ children }){
  const token = localstorage.getItem('jwtToken');
  const user = JSON.parse(localStorage.getItem('user'));
  return token && user?.is_admin ? children : <Navigate to="/main" />;
}

export default function App() {
  useEffect(() => {
    loadAuthToken();
  }, []);

  return (
    <Router>
      <div className="h-screen">
        <Routes>
          {/* Redirección raíz */}
          <Route path="/" element={<Navigate to="/main" />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />  {/* ruta logout */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Ruta Principal (requiere login) */}
          <Route path="/main" element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          } />

          {/* Dashboard admin (requiere ser admin) */}
          <Route
             path="/admin/dashboard"
             element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
             }
          />

          {/* Ruta 404 opcional */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
