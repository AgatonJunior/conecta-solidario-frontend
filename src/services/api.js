import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api-conecta-solidario-org-ajuda.onrender.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');

      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    const msg =
      err.response?.data?.erro ||
      err.response?.data?.mensagem ||
      err.response?.data?.error ||
      'Erro inesperado';

    return Promise.reject(new Error(msg));
  }
);

export default api;
