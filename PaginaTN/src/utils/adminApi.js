import { apiUrl } from '../lib/apiUrl.js';

export function getAdminToken() {
  return sessionStorage.getItem('adminToken');
}

export function setAdminSession(token, email) {
  sessionStorage.setItem('adminToken', token);
  sessionStorage.setItem('adminEmail', email);
}

export function clearAdminSession() {
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminEmail');
}

export async function adminFetch(url, options = {}) {
  const token = getAdminToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = { ...(options.headers || {}) };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(apiUrl(url), { ...options, headers });

  if (res.status === 401) {
    clearAdminSession();
    window.location.href = '/admin/login';
    throw new Error('Sesión expirada');
  }

  return res;
}
