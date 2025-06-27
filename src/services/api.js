import axios from 'axios';

// Detectar si estamos en producción (Vite usa import.meta.env.MODE)
const isProduction = import.meta.env.MODE === 'production';

// Configurar la base URL dependiendo del entorno
const baseURL = isProduction
  ? import.meta.env.VITE_API_URL || 'https://web-production-31e3.up.railway.app/api'
  : 'http://localhost:5000/api'; // Local dev

// Crear instancia de axios
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    console.log("👉 API URL:", baseURL);
  },
});

// Almacenamiento del token JWT
let jwtToken = null;

// ----------- Token Management -------------

export function setAuthToken(token) {
  jwtToken = token;
  localStorage.setItem('jwtToken', token);
}

export function loadAuthToken() {
  const storedToken = localStorage.getItem('jwtToken');
  if (storedToken) {
    jwtToken = storedToken;
  }
}

export function clearAuthToken() {
  jwtToken = null;
  localStorage.removeItem('jwtToken');
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

const AUTH = '/auth';
const AGENTS = '/agents';
const TOOLS = '/tools';
const CHAT = '/chat';

// ----------- AGENTS -----------------------

export async function fetchAgents() {
  const res = await api.get(AGENTS);
  return res.data;
}

export async function createAgent(agent) {
  const res = await api.post(AGENTS, agent);
  return res.data;
}

export async function updateAgent(agentId, agent) {
  const res = await api.put(`${AGENTS}/${agentId}`, agent);
  return res.data;
}

export async function deleteAgent(agentId) {
  const res = await api.delete(`${AGENTS}/${agentId}`);
  return res.data;
}

// ------------- TOOLS ----------------------

export async function fetchTools() {
  const res = await api.get(TOOLS);
  return res.data;
}

export async function createTool(tool) {
  const res = await api.post(TOOLS, tool);
  return res.data;
}

export async function updateTool(toolId, tool) {
  const res = await api.put(`${TOOLS}/${toolId}`, tool);
  return res.data;
}

export async function deleteTool(toolId) {
  const res = await api.delete(`${TOOLS}/${toolId}`);
  return res.data;
}

// -------------- CHAT ----------------------

export async function fetchChats(agentId) {
  const res = await api.get(`${AGENTS}/${agentId}/chats`);
  return res.data;
}

export async function deleteChats(agentId) {
  const res = await api.delete(`${AGENTS}/${agentId}/chats`);
  return res.data;
}

export async function sendMessage(agentId, message) {
  const res = await api.post(`${CHAT}/${agentId}`, { message });
  return res.data;
}

// ---------- AUTENTICACIÓN -----------------

export async function loginUser(credentials) {
  const res = await api.post(`${AUTH}/login`, credentials);
  const data = res.data;

  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
}

export async function registerUser(data) {
  const res = await api.post(`${AUTH}/register`, data);
  return res.data;
}

export async function getProfile() {
  const res = await api.get(`${AUTH}/me`);
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get(`${AUTH}/me`);
  return res.data.user;
}

export async function changePassword(current_password, new_password) {
  const res = await api.put(`${AUTH}/change-password`, {
    current_password,
    new_password,
  });
  return res.data;
}

export async function updateProfile(data) {
  const res = await api.put(`${AUTH}/update-profile`, data);
  return res.data;
}

// ---------- Admin -------------------------

export async function fetchUsers() {
  const res = await api.get('/admin/users');
  return res.data.users;
}

export async function updateUserRole(userId, isAdmin) {
  const res = await api.put(`/admin/users/${userId}/role`, { isAdmin });
  return res.data;
}

export async function fetchLogs() {
  const res = await api.get('/admin/logs');
  return res.data.logs;
}

// --------- Token inicial ------------------

loadAuthToken();
