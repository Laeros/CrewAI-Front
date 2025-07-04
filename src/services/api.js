import axios from 'axios';

// Detectar si estamos en producción
const isProduction = process.env.NODE_ENV === 'production';

// Configurar la base URL dependiendo del entorno
const baseURL = isProduction
  ? import.meta.env.VITE_API_URL || 'https://crewaiapp-production.up.railway.app/api'
  : 'http://localhost:5000/api';

// Crear instancia de axios con CORS + credenciales
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// Almacenamiento del token JWT (si usas tokens manualmente además de cookies)
let jwtToken = null;

// ----------- Token Management -------------

export function setAuthToken(token) {
  jwtToken = token;
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('jwtToken', token);
  }
}

export function loadAuthToken() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedToken = window.localStorage.getItem('jwtToken');
    if (storedToken) {
      jwtToken = storedToken;
    }
  }
}

export function clearAuthToken() {
  jwtToken = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('jwtToken');
    window.localStorage.removeItem('user');
  }
}

// ------------ Interceptors ----------------

// Interceptor para agregar token a cada request
api.interceptors.request.use(
  (config) => {
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Sesión expirada o no autorizada. Redirigiendo al login...');
      clearAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ------------ ENDPOINTS -------------------

const ROUTES = {
  AUTH: '/auth',
  AGENTS: '/agents',
  TOOLS: '/tools',
  CHAT: '/chat',
  ADMIN: '/admin',
};

// ----------- AGENTS -----------------------

export async function fetchAgents() {
  const res = await api.get(ROUTES.AGENTS);
  return res.data;
}

export async function createAgent(agent) {
  const res = await api.post(ROUTES.AGENTS, agent);
  return res.data;
}

export async function updateAgent(agentId, agent) {
  const res = await api.put(`${ROUTES.AGENTS}/${agentId}`, agent);
  return res.data;
}

export async function deleteAgent(agentId) {
  const res = await api.delete(`${ROUTES.AGENTS}/${agentId}`);
  return res.data;
}

// ------------- TOOLS ----------------------

export async function fetchTools() {
  const res = await api.get(ROUTES.TOOLS);
  return res.data;
}

export async function createTool(tool) {
  const res = await api.post(ROUTES.TOOLS, tool);
  return res.data;
}

export async function updateTool(toolId, tool) {
  const res = await api.put(`${ROUTES.TOOLS}/${toolId}`, tool);
  return res.data;
}

export async function deleteTool(toolId) {
  const res = await api.delete(`${ROUTES.TOOLS}/${toolId}`);
  return res.data;
}

// -------------- CHAT ----------------------

export async function fetchChats(agentId) {
  const res = await api.get(`${ROUTES.AGENTS}/${agentId}/chats`);
  return res.data;
}

export async function deleteChats(agentId) {
  const res = await api.delete(`${ROUTES.AGENTS}/${agentId}/chats`);
  return res.data;
}

export async function sendMessage(agentId, message) {
  const res = await api.post(`${ROUTES.CHAT}/${agentId}`, { message });
  return res.data;
}

// ---------- AUTENTICACIÓN -----------------

export async function loginUser(credentials) {
  const res = await api.post(`${ROUTES.AUTH}/login`, credentials);
  const data = res.data;

  if (data.token) {
    setAuthToken(data.token);

    // Obtener perfil y guardar usuario
    try {
      const profileRes = await getProfile();
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('user', JSON.stringify(profileRes.user));
      }
    } catch (error) {
      console.error('❌ Error al obtener perfil del usuario:', error);
    }
  }

  return data;
}

export async function registerUser(data) {
  const res = await api.post(`${ROUTES.AUTH}/register`, data);
  return res.data;
}

export async function getProfile() {
  const res = await api.get(`${ROUTES.AUTH}/me`);
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get(`${ROUTES.AUTH}/me`);
  return res.data.user;
}

export async function changePassword(current_password, new_password) {
  const res = await api.put(`${ROUTES.AUTH}/change-password`, {
    current_password,
    new_password,
  });
  return res.data;
}

export async function updateProfile(data) {
  const res = await api.put(`${ROUTES.AUTH}/update-profile`, data);
  return res.data;
}

// ---------- ADMINISTRACIÓN ----------------

export async function fetchUsers() {
  const res = await api.get(`${ROUTES.ADMIN}/users`);
  return res.data.users;
}

export async function updateUserRole(userId, isAdmin) {
  const res = await api.put(`${ROUTES.ADMIN}/users/${userId}/role`, { isAdmin });
  return res.data;
}

export async function fetchLogs() {
  const res = await api.get(`${ROUTES.ADMIN}/logs`);
  return res.data.logs;
}

// ---------- Utilidades --------------------

export async function checkApiHealth() {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (error) {
    console.error('Error al verificar el estado de la API:', error);
    throw error;
  }
}

export function getCurrentBaseURL() {
  return baseURL;
}

// ---------- Cargar token al iniciar --------
// loadAuthToken();
