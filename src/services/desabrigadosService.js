import api from './api';
export const desabrigadosService = {
  async listar()             { const { data } = await api.get('/desabrigados'); return data; },
  async registrarEntrada(d)  { const { data } = await api.post('/desabrigados', d); return data; },
  async registrarSaida(id)   { const { data } = await api.patch(`/desabrigados/${id}/saida`); return data; },
};
