import api from './api';

export const authService = {
  async login(email, senha) {
    const { data } = await api.post('/loginUsuario', { email, senha });
    localStorage.setItem('token', data.token);
    return data.token;
  },
  logout() {
    localStorage.removeItem('token');
  },
  getToken() {
    return localStorage.getItem('token');
  },
  isLogado() {
    return Boolean(localStorage.getItem('token'));
  }
};