import api from './api';
export const voluntariosService = {
  async listar()                    { const { data } = await api.get('/voluntarios'); return data; },
  async criar(v)                    { const { data } = await api.post('/voluntarios', v); return data; },
  async atualizar(id, v)            { const { data } = await api.put(`/voluntarios/${id}`, v); return data; },
  async alterarDisponibilidade(id, disponivel) { const { data } = await api.patch(`/voluntarios/${id}/disponibilidade`, { disponivel }); return data; },
  async deletar(id)                 { await api.delete(`/voluntarios/${id}`); },
};
