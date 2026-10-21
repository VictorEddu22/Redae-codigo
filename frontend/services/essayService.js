import { apiRequest } from './api';

export const essayService = {
  async create(payload) {
    return apiRequest('/api/essays', {
      method: 'POST',
      body: JSON.stringify({
        titulo: payload.titulo,
        tema: payload.tema,
        texto: payload.texto,
      }),
      timeoutMs: 120000,
    });
  },

  async list() {
    return apiRequest('/api/essays');
  },

  async getById(id) {
    if (!id) throw new Error('Redação não informada.');
    return apiRequest(`/api/essays/${encodeURIComponent(id)}`);
  },

  async performance() {
    return apiRequest('/api/essays/performance');
  },

  async remove(id) {
    return apiRequest(`/api/essays/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
};
