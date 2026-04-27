import api from './api';
export const abrigosService = {
  async listar()         { const { data } = await api.get('/abrigos'); return data; },
  async criar(a)         { const { data } = await api.post('/abrigos', a); return data.post; },
  async atualizar(id, a) { const { data } = await api.put(`/abrigos/${id}`, a); return data.post; },
  async deletar(id)      { await api.delete(`/abrigos/${id}`); },
};
