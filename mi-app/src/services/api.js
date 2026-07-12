const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('ip_token');

async function request(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Error en la solicitud');
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  getComponents: () => request('/components'),
  getComponentById: (id) => request(`/components/${id}`),
  createComponent: (data) =>
    request('/components', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateComponent: (id, data) =>
    request(`/components/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteComponent: (id) =>
    request(`/components/${id}`, {
      method: 'DELETE'
    }),

  getMovements: () => request('/movements'),
  createMovement: (data) =>
    request('/movements', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getStockAlerts: () => request('/alerts/stock'),

  getSummary: () => request('/reports/summary'),
  getValuation: () => request('/reports/valuation'),
  exportReport: () => request('/reports/export'),

  getUsers: () => request('/users'),
  createUser: (data) =>
    request('/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateUserStatus: (id, status) =>
    request(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
  deleteUser: (id) =>
    request(`/users/${id}`, {
      method: 'DELETE'
    })
};