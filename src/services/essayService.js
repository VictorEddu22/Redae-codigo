import { apiRequest, isApiEnabled } from './api';
import { demoEssays } from '../data/mockData';

const STORAGE_KEY = 'redae.essays';

function getSavedEssays() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveEssays(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function createMockResult(payload) {
  const id = crypto.randomUUID?.() || String(Date.now());
  const base = 760 + Math.min(160, Math.floor((payload.texto?.length || 0) / 18));
  const score = Math.min(960, Math.max(680, base));
  const competencies = [
    { code: 'C1', label: 'Norma-padrão', score: Math.min(200, score - 700 + 120) },
    { code: 'C2', label: 'Compreensão do tema', score: Math.min(200, score - 700 + 140) },
    { code: 'C3', label: 'Argumentação', score: Math.min(200, score - 700 + 110) },
    { code: 'C4', label: 'Coesão', score: Math.min(200, score - 700 + 130) },
    { code: 'C5', label: 'Intervenção', score: Math.min(200, score - 700 + 100) },
  ].map((item) => ({ ...item, score: Math.max(120, item.score) }));

  return {
    id,
    titulo: payload.titulo,
    tema: payload.tema,
    texto: payload.texto,
    status: 'Corrigida',
    nota: score,
    createdAt: new Date().toISOString(),
    competencias: competencies,
    feedback:
      'Seu texto apresenta uma linha argumentativa clara e boa organização. O próximo ganho de nota está em tornar os exemplos mais específicos e conectar melhor a conclusão aos argumentos desenvolvidos.',
    pontosFortes: [
      'Tema desenvolvido sem fuga ao recorte proposto.',
      'Estrutura de introdução, desenvolvimento e conclusão bem identificada.',
      'Boa escolha de conectivos para conduzir a leitura.',
    ],
    pontosMelhorar: [
      'Aprofundar o repertório sociocultural em pelo menos um parágrafo.',
      'Evitar períodos muito extensos para ganhar clareza.',
      'Detalhar agente, ação, meio e finalidade na proposta de intervenção.',
    ],
  };
}

export const essayService = {
  async create(payload) {
    if (isApiEnabled()) {
      try {
        const response = await apiRequest('/default/Redacao', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        return response;
      } catch {
        // Enquanto o model/rota final de redação não existir, usa o modo local.
      }
    }

    const result = createMockResult(payload);
    const items = getSavedEssays();
    items.unshift(result);
    saveEssays(items);
    return result;
  },

  async list() {
    const local = getSavedEssays();
    return local.length ? [...local, ...demoEssays] : demoEssays;
  },

  async getById(id) {
    const all = await this.list();
    return all.find((item) => String(item.id) === String(id)) || all[0];
  },
};
