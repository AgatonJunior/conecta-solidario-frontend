import api from './api';
export const dashboardService = {
  async obterKpis() { const { data } = await api.get('/dashboard'); return data; },
};
