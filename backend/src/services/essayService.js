import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

function summaryOf(essay) {
  return {
    id: essay.id,
    titulo: essay.titulo,
    tema: essay.tema,
    nota: essay.nota,
    status: essay.status,
    competencias: essay.competencias,
    createdAt: essay.createdAt,
    updatedAt: essay.updatedAt,
  };
}

export class EssayService {
  constructor(essayRepository, correctionService) {
    this.essays = essayRepository;
    this.correction = correctionService;
  }

  async createAndCorrect(userId, payload) {
    const correction = await this.correction.correct(payload);
    return this.essays.create({
      userId,
      titulo: payload.titulo || 'Redacao sem titulo',
      tema: payload.tema,
      texto: payload.texto,
      status: 'Corrigida',
      ...correction,
      ai: {
        provider: 'google-gemini',
        model: env.geminiModel,
        generatedAt: new Date().toISOString(),
        disclaimer: 'Estimativa pedagogica automatizada; nao equivale a uma correcao oficial do ENEM.',
      },
    });
  }

  async list(userId) {
    const items = await this.essays.listByUserId(userId);
    return items.map(summaryOf);
  }

  async getById(userId, id) {
    const essay = await this.essays.findById(id);
    if (!essay || essay.userId !== userId) throw new HttpError(404, 'Redacao nao encontrada.', 'ESSAY_NOT_FOUND');
    return essay;
  }

  async delete(userId, id) {
    const deleted = await this.essays.deleteByIdForUser(id, userId);
    if (!deleted) throw new HttpError(404, 'Redacao nao encontrada.', 'ESSAY_NOT_FOUND');
  }

  async performance(userId) {
    const essays = await this.essays.listByUserId(userId);
    const corrected = essays.filter((item) => Number.isFinite(Number(item.nota)));
    const chronological = [...corrected].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const scores = chronological.map((item) => Number(item.nota));

    const competencyAverages = ['C1', 'C2', 'C3', 'C4', 'C5'].map((code) => {
      const values = corrected
        .map((essay) => essay.competencias?.find((item) => item.code === code)?.score)
        .map(Number)
        .filter(Number.isFinite);
      return { code, value: values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0 };
    });

    return {
      total: corrected.length,
      media: scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0,
      melhor: scores.length ? Math.max(...scores) : 0,
      evolucao: scores.length > 1 ? scores.at(-1) - scores[0] : 0,
      competencias: competencyAverages,
      timeline: chronological.map(summaryOf),
    };
  }
}
